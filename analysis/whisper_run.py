import common
import json, sys
import whisper

def run(tag, prompt=None):
    model = whisper.load_model("base")
    res = model.transcribe(str(common.WORK / "vocals16k.wav"), word_timestamps=True, initial_prompt=prompt, condition_on_previous_text=False)
    out = common.WORK / f"whisper_{tag}.json"
    out.write_text(json.dumps(res, indent=1, default=float))
    for seg in res["segments"]:
        print(f"{seg['start']:7.2f} {seg['end']:7.2f} {seg['text']}")
    return res

if __name__ == "__main__":
    prompt = ("Song lyrics about multi-tenant Medusa v2.")
    run("turbo")
    run("turbo_prompt", prompt)
