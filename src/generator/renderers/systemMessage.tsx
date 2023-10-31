import { DiscordReaction, DiscordReactions, DiscordSystemMessage } from '@derockdev/discord-components-react';
import { MessageType, type GuildMember, type Message, type User } from 'discord.js';
import React from 'react';
import { parseDiscordEmoji } from '../../utils/utils';

export default async function renderSystemMessage(message: Message) {
  switch (message.type) {
    case MessageType.RecipientAdd:
    case MessageType.UserJoin:
      return (
        <DiscordSystemMessage id={`m-${message.id}`} key={message.id} type="join">
          {JoinMessage(message.member, message.author)}
        </DiscordSystemMessage>
      );

    case MessageType.ChannelPinnedMessage:
      return (
        <DiscordSystemMessage id={`m-${message.id}`} key={message.id} type="pin">
          <Highlight color={message.member?.roles.color?.hexColor}>
            {message.author.displayName ?? message.author.username}
          </Highlight> {
            `${message.guild?.translate?.("tickets/attachments:PINNED") ?? "pinned"}`
          } {' '}
          <i data-goto={message.reference?.messageId}>{ `${message.guild?.translate?.("tickets/attachments:A_MESSAGE") ?? "a message"}` }</i> {' '} {
            `${message.guild?.translate?.("tickets/attachments:IN_THIS_CHANNEL") ?? "to this channel"}`
          }.
          {/* reactions */}
          {message.reactions.cache.size > 0 && (
            <DiscordReactions slot="reactions">
              {message.reactions.cache.map((reaction, id) => (
                <DiscordReaction
                  key={`${message.id}r${id}`}
                  name={reaction.emoji.name!}
                  emoji={parseDiscordEmoji(reaction.emoji)}
                  count={reaction.count}
                />
              ))}
            </DiscordReactions>
          )}
        </DiscordSystemMessage>
      );

    case MessageType.GuildBoost:
    case MessageType.GuildBoostTier1:
    case MessageType.GuildBoostTier2:
    case MessageType.GuildBoostTier3:
      return (
        <DiscordSystemMessage id={`m-${message.id}`} key={message.id} type="boost">
          <Highlight color={message.member?.roles.color?.hexColor}>
            {message.author.displayName ?? message.author.username}
          </Highlight> {
            `${message.guild?.translate?.("tickets/attachments:BOOSTED_SERVEUR") ?? "boosted the server!"}`
          }
        </DiscordSystemMessage>
      );

    case MessageType.ThreadStarterMessage:
      return (
        <DiscordSystemMessage id={`ms-${message.id}`} key={message.id} type="thread">
          <Highlight color={message.member?.roles.color?.hexColor}>
            {message.author.displayName ?? message.author.username}
          </Highlight> {
            `${message.guild?.translate?.("tickets/attachments:STARTED_THREAD") ?? "started a thread:"}`
          } <i data-goto={message.reference?.messageId}>{message.content}</i>
        </DiscordSystemMessage>
      );

    default:
      return undefined;
  }
}

export function Highlight({ children, color }: { children: React.ReactNode; color?: string }) {
  return <i style={{ color: color ?? 'white' }}>{children}</i>;
}

export function JoinMessage(member: GuildMember | null, fallbackUser: User) {
  const allJoinMessages = [
    member?.guild?.translate?.("tickets/attachments:DISCORD_JOIN_MESSAGE_0") ?? "{{user}} has arrived.",
    member?.guild?.translate?.("tickets/attachments:DISCORD_JOIN_MESSAGE_1") ?? "A wild {{user}} appears.",
    member?.guild?.translate?.("tickets/attachments:DISCORD_JOIN_MESSAGE_2") ?? "{{user}} just arrived!",
    member?.guild?.translate?.("tickets/attachments:DISCORD_JOIN_MESSAGE_3") ?? "{{user}} has joined the group.",
    member?.guild?.translate?.("tickets/attachments:DISCORD_JOIN_MESSAGE_4") ?? "Welcome, {{user}}. Say hi!",
    member?.guild?.translate?.("tickets/attachments:DISCORD_JOIN_MESSAGE_5") ?? "{{user}} just slipped into the server.",
    member?.guild?.translate?.("tickets/attachments:DISCORD_JOIN_MESSAGE_6") ?? "Everyone, welcome {{user}} as it should be!",
    member?.guild?.translate?.("tickets/attachments:DISCORD_JOIN_MESSAGE_7") ?? "Hooray, you did it, {{user}}!",
    member?.guild?.translate?.("tickets/attachments:DISCORD_JOIN_MESSAGE_8") ?? "Welcome, {{user}}. Hope you brought some pizza",
    member?.guild?.translate?.("tickets/attachments:DISCORD_JOIN_MESSAGE_9") ?? "{{user}} has bounced into the server."
  ];

  const randomMessage = allJoinMessages[Math.floor(Math.random() * allJoinMessages.length)];

  return (randomMessage as string)
    .split('{{user}}')
    .flatMap((item, i) => [
      item,
      <Highlight color={member?.roles.color?.hexColor} key={i}>
        {member?.nickname ?? fallbackUser.displayName ?? fallbackUser.username}
      </Highlight>,
    ])
    .slice(0, -1);
}
