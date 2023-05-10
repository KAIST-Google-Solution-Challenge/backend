import speech from '@google-cloud/speech';
import logger from './logger';

// Creates a client
export async function transcribeMp3(url: string) {
  const client = new speech.v1p1beta1.SpeechClient();
  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    uri: url,
  };
  const config = {
    encoding: 'MP3' as 'MP3',
    sampleRateHertz: 44100,
    languageCode: 'ko-KR',
    model: 'latest_long',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transcription = response.results.map((result) => result.alternatives[0].transcript).join('\n');
  return transcription;
}

export async function transcribeWav(url: string) {
  const client = new speech.v1.SpeechClient();
  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    uri: url,
  };
  const config = {
    encoding: 'LINEAR16' as 'LINEAR16',
    sampleRateHertz: 44100,
    languageCode: 'ko-KR',
    model: 'latest_long',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  // const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  // const [response] = await operation.promise();

  const [response] = await client.recognize(request);
  const transcription = response.results.map((result) => result.alternatives[0].transcript).join('\n');
  logger.debug(transcription);
  return transcription;
}
