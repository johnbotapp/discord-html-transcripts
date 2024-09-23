import { type Awaitable, type Channel, type Message, type Role, type User } from 'discord.js';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { buildProfiles } from '../utils/buildProfiles';
import { revealSpoiler, scrollToMessage, copyMessageId } from '../static/client';
import { readFileSync } from 'fs';
import path from 'path';
import { renderToString } from '@derockdev/discord-components-core/hydrate';
import { streamToString } from '../utils/utils';
import DiscordMessages from './transcript';
import type { ResolveImageCallback } from '../downloader/images';

declare module 'discord.js' {
  interface Guild {
    translate: (key: string, ...args: unknown[]) => Promise<string>;
  }
}

// read the package.json file and get the @derockdev/discord-components-core version
let discordComponentsVersion = '^3.6.1';

try {
  const packagePath = path.join(__dirname, '..', '..', 'package.json');
  const packageJSON = JSON.parse(readFileSync(packagePath, 'utf8'));
  discordComponentsVersion = packageJSON.dependencies['@derockdev/discord-components-core'] ?? discordComponentsVersion;
  // eslint-disable-next-line no-empty
} catch {} // ignore errors

export type RenderMessageContext = {
  messages: Message[];
  channel: Channel;

  callbacks: {
    resolveImageSrc: ResolveImageCallback;
    resolveChannel: (channelId: string) => Awaitable<Channel | null>;
    resolveUser: (userId: string) => Awaitable<User | null>;
    resolveRole: (roleId: string) => Awaitable<Role | null>;
  };

  locale?: string;
  poweredBy?: boolean;
  footerText?: string;
  saveImages: boolean;
  favicon: 'guild' | string;
  hydrate: boolean;
};

export default async function render({ messages, channel, callbacks, ...options }: RenderMessageContext) {
  const profiles = buildProfiles(messages);

  if (!channel.isDMBased() && channel.name.startsWith("closed-")) channel.name = channel.name.slice(7);

  // NOTE: this renders a STATIC site with no interactivity
  // if interactivity is needed, switch to renderToPipeableStream and use hydrateRoot on client.
  const stream = ReactDOMServer.renderToStaticNodeStream(
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* favicon */}
        <link
          rel="icon"
          type="image/png"
          href="https://cdn.johnbot.app/img/favicon.png"
        />

        {/* title */}
        <title>{channel.isDMBased() ? 'Direct Messages' : `${channel.guild.name} - John-Bot`}</title>

        {/* message reference handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: scrollToMessage,
          }}
        />

        {!options.hydrate && (
          <>
            {/* styles */}
            <link
              rel="stylesheet"
              href={`https://cdn.johnbot.app/css/transcripts.css`}
            />
            {/* scripts */}
            <script
              src='https://cdn.johnbot.app/js/transcripts.js'
            ></script>
            {/* profiles */}
            <script
              dangerouslySetInnerHTML={{
                __html: `window.$discordMessage={profiles:${JSON.stringify(await profiles)}}`,
              }}
            ></script>
            {/* component library */}
            <script
              type="module"
              src={`https://cdn.jsdelivr.net/npm/@derockdev/discord-components-core@${discordComponentsVersion}/dist/derockdev-discord-components-core/derockdev-discord-components-core.esm.js`}
            ></script>
          </>
        )}
      </head>

      <body
        style={{
          margin: 0,
          minHeight: '100vh',
        }}
      >
        {/* header */}
        <div>
          <section>
            <span style={{ fontSize: '28px', color: "#fff", fontWeight: 600 }}>
              {channel.isDMBased() ? 'Welcome to' : `${channel.guild?.translate?.("tickets/attachments:WELCOME_TO") ?? "Welcome to"} #${channel.name} !`}
            </span>
            <span style={{ fontSize: '16px', color: "#b9bbbe", fontWeight: 400 }}>
              {channel.isDMBased() ? 'This is the start of the' : `${channel.guild?.translate?.("tickets/attachments:CHANNEL_START") ?? "This is the start of the"} #${channel.name} ${channel.guild?.translate?.("words:CHANNEL_MIN") ?? "channel"}.`}
            </span>
          </section>
          <header>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#80848e" viewBox="0 0 24 24">
              <path d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z" />
            </svg>
            {channel.isDMBased() ? 'Direct Messages' : `${channel.name}`}
          </header>
        </div>

        {/* messages */}
        <DiscordMessages messages={messages} channel={channel} callbacks={callbacks} {...options} />

        {/* footer */}
        <footer>
          {channel.isDMBased() ? 'This archive has been generated on the' : `${channel.guild?.translate?.("tickets/attachments:ARCHIVE_GENERATE") ?? "This archive has been generated on the"}`}
          {' '}
          <time id="footer-timestamp" data-timestamp={Math.floor(new Date().getTime() / 1000)} data-locale={options.locale ?? 'en-US'}></time>
        </footer>

        {/* context menu */}
        <div id="context-menu" className="context-menu">
          <div className="item">
            {channel.isDMBased() ? 'Copy Message ID' : `${channel.guild?.translate?.("tickets/attachments:COPY_MESSAGE_ID") ?? "Copy Message ID"}`}
          </div>
        </div>
      </body>

      {/* Make sure the script runs after the DOM has loaded */}
      {options.hydrate && <script dangerouslySetInnerHTML={{ __html: revealSpoiler }}></script> || <script dangerouslySetInnerHTML={{ __html: copyMessageId }}></script>}
    </html>
  );

  const markup = await streamToString(stream);

  if (options.hydrate) {
    const result = await renderToString(markup, {
      beforeHydrate: async (document) => {
        document.defaultView.$discordMessage = {
          profiles: await profiles,
        };
      },
    });

    return result.html;
  }

  return markup;
}
