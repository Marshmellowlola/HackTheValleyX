
from elevenlabs.client import ElevenLabs
from elevenlabs import stream

elevenlabs = ElevenLabs(api_key='sk_5e4f09156d0c3076c33822d8dbb8e2cf8e9001a44d3f62d8')

audio_stream = elevenlabs.text_to_speech.stream(
    text="This is a test",
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_multilingual_v2"
)

# option 1: play the streamed audio locally
stream(audio_stream)


