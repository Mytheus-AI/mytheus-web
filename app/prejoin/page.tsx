import Link from "next/link";
import { WaveIcon, CamIcon } from "@/components/icons";

export default function PrejoinPage() {
  return (
    <section className="page" id="page-prejoin">
      <div className="prejoin-wrap">
        <div className="prejoin-box reveal">
          <h1>Ready to join?</h1>
          <p>Design review — mobile onboarding · starts in 4 minutes · 5 people invited</p>

          <div className="preview-card">
            <span className="preview-name scrim-pill">
              <WaveIcon />
              Wayne — camera is on
            </span>
            <span className="mic-meter scrim-pill" role="img" aria-label="Microphone level">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </span>
          </div>

          <div className="device-row">
            <label className="field">
              <span>Camera</span>
              <select>
                <option>Built-in HD camera</option>
                <option>USB webcam</option>
              </select>
            </label>
            <label className="field">
              <span>Microphone</span>
              <select>
                <option>Built-in microphone</option>
                <option>Headset</option>
              </select>
            </label>
          </div>

          <div className="prejoin-ctas">
            <Link href="/home" className="btn-ghost tap">
              Back
            </Link>
            <Link href="/meeting" className="btn-dark tap" style={{ background: "var(--accent)" }}>
              <CamIcon size={16} />
              Join meeting
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
