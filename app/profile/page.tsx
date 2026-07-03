"use client";

import { useState } from "react";
import { CloseIcon, PeopleIcon } from "@/components/icons";
import { Tag } from "@/components/Tag";
import { useToast } from "@/contexts/ToastContext";

const TEAM = [
  { av: "p-av-3", name: "Cloe", handle: "@cloerose", role: "Lead" },
  { av: "p-av-1", name: "Wayne (You)", handle: "@johnwayne" },
  { av: "p-av-5", name: "Milana", handle: "@milanaray" },
  { av: "p-av-6", name: "Keith", handle: "@keithnorth" },
  { av: "p-av-7", name: "Thomas", handle: "@thomasup" },
];

export default function ProfilePage() {
  const [skills, setSkills] = useState(["backend", "pricing", "onboarding"]);
  const [skillInput, setSkillInput] = useState("");
  const toast = useToast();

  function removeSkill(skill: string) {
    setSkills((s) => s.filter((x) => x !== skill));
  }

  function addSkill(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const val = skillInput.trim().toLowerCase();
    if (!val) return;
    setSkills((s) => [...s, val]);
    setSkillInput("");
  }

  return (
    <section className="page" id="page-profile">
      <div className="page-scroll">
        <div className="page-inner" style={{ maxWidth: 1040 }}>
          <div className="screen-head reveal">
            <h1>Profile &amp; team</h1>
            <p>What your agent knows about you — it filters every meeting through this</p>
          </div>

          <div className="profile-grid">
            <div className="profile-stack reveal" style={{ animationDelay: ".09s" }}>
              <div className="white-card">
                <div className="profile-id">
                  <span className="profile-avatar" aria-hidden="true"></span>
                  <span>
                    <strong>Wayne Sanders</strong>
                    <small>@johnwayne · Core team</small>
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <label className="field">
                    <span>Role</span>
                    <input type="text" defaultValue="Product engineer" />
                  </label>
                  <label className="field">
                    <span>Team</span>
                    <input type="text" defaultValue="Core team" />
                  </label>
                </div>
                <div className="field" style={{ marginBottom: 12 }}>
                  <span>Skills — your agent listens for these</span>
                  <div className="skill-chips" style={{ background: "var(--chipNeutralBg)", borderRadius: 12, padding: "8px 10px" }}>
                    {skills.map((skill) => (
                      <span className="skill-chip" key={skill}>
                        {skill}
                        <button type="button" className="skill-x tap" aria-label={`Remove ${skill}`} onClick={() => removeSkill(skill)}>
                          <CloseIcon size={9} />
                        </button>
                      </span>
                    ))}
                    <input
                      className="skill-add"
                      placeholder="Add a skill…"
                      aria-label="Add a skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                    />
                  </div>
                </div>
                <label className="field">
                  <span>Bio</span>
                  <textarea defaultValue="I ship the pricing and onboarding surfaces. Ask me before touching the checkout flow." />
                </label>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                  <button
                    type="button"
                    className="btn-dark tap"
                    style={{ height: 38, padding: "0 18px", fontSize: "12.5px" }}
                    onClick={() => toast("Profile saved — your agent will use it in the next meeting")}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>

            <div className="profile-stack reveal" style={{ animationDelay: ".18s" }}>
              <div className="white-card">
                <div className="section-label" style={{ padding: "0 0 10px" }}>
                  Core team <span className="count-chip">5</span>
                  <div className="label-actions">
                    <button type="button" className="label-icon-btn tap" data-tip="Add member" aria-label="Add member">
                      <PeopleIcon size={15} />
                    </button>
                  </div>
                </div>
                {TEAM.map((m) => (
                  <div className="member-row" key={m.handle}>
                    <span className={`p-av ${m.av}`}></span>
                    <span>
                      <strong>{m.name}</strong> <small>{m.handle}</small>
                    </span>
                    {m.role && (
                      <Tag variant="orange">{m.role}</Tag>
                    )}
                  </div>
                ))}
              </div>

              <div className="white-card">
                <div className="section-label" style={{ padding: "0 0 12px" }}>
                  Organization
                </div>
                <div className="org-tree">
                  <span className="org-node is-root">Mytheus Labs</span>
                  <span className="org-link"></span>
                  <div className="org-row">
                    <div className="org-branch">
                      <span className="org-node">Product</span>
                      <span className="org-link"></span>
                      <span className="org-node is-team">Core team</span>
                    </div>
                    <div className="org-branch">
                      <span className="org-node">Engineering</span>
                      <span className="org-link"></span>
                      <span className="org-node is-team">Platform</span>
                    </div>
                    <div className="org-branch">
                      <span className="org-node">Design</span>
                      <span className="org-link"></span>
                      <span className="org-node is-team">Studio</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
