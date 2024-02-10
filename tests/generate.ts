import * as discord from 'discord.js';
import { TranscriptImageDownloader, createTranscript } from '../src';

import { config } from 'dotenv';
config();

const client = new discord.Client({
  intents: [discord.IntentsBitField.Flags.GuildMessages, discord.IntentsBitField.Flags.Guilds],
});

client.on('ready', async () => {
  console.log('Fetching channel: ', process.env.CHANNEL!);
  const channel = await client.channels.fetch(process.env.CHANNEL!);

  if (!channel || !channel.isTextBased()) {
    console.error('Invalid channel provided.');
    process.exit(1);
  }

  console.time('transcript');
  const attachment = await createTranscript(channel, {
    // saveImages: true,
    callbacks: {
      resolveImageSrc: new TranscriptImageDownloader()
        .withMaxSize(5120) // 5MB in KB
        .withCompression(40, true) // 40% quality, convert to webp
        .build(),
    },
  });
  console.timeEnd('transcript');

  await channel.send({
    files: [attachment],
  });

  client.destroy();
  process.exit(0);
});

client.login(process.env.TOKEN!);
