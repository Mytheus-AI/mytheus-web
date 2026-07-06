"use client";

import { useState } from "react";
import { CloseIcon, PeopleIcon, SparkleIcon } from "@/components/icons";
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
        <div className="page-inner" style={{ maxWidth: 1240 }}>
          <div className="screen-head reveal">
            <div className="head-text">
              <h1>Profile &amp; team</h1>
              <p>What your agent knows about you. It filters every meeting through this.</p>
            </div>
            <div className="head-actions">
              <button type="button" className="btn-dark tap" onClick={() => toast("Profile saved. Your agent will use it in the next meeting.")}>
                Save changes
              </button>
            </div>
          </div>

          <div className="canvas cols-2 is-fill">
            <div className="rail-stack">
              <div className="panel reveal" style={{ animationDelay: ".09s" }}>
                <div className="panel-head">
                  <h2>Identity</h2>
                </div>
                <div className="panel-body">
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
                  <label className="field">
                    <span>Bio</span>
                    <textarea defaultValue="I ship the pricing and onboarding surfaces. Ask me before touching the checkout flow." />
                  </label>
                </div>
              </div>

              <div className="panel reveal" style={{ animationDelay: ".14s" }}>
                <div className="panel-head">
                  <h2>What your agent listens for</h2>
                </div>
                <div className="panel-body">
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
                      placeholder="Add a skill"
                      aria-label="Add a skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                    />
                  </div>
                  <p className="rail-note">
                    Mentions of these topics, your name or your team land in your worklog with a relevance score.
                  </p>
                  <div className="row-chips">
                    <Tag variant="orange" icon={<SparkleIcon size={10} />}>
                      Used in every meeting you attend
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            <div className="rail-stack">
              <div className="panel reveal" style={{ animationDelay: ".14s" }}>
                <div className="panel-head">
                  <h2>Core team</h2>
                  <span className="count-chip">{TEAM.length}</span>
                  <div className="label-actions">
                    <button type="button" className="label-icon-btn tap" data-tip="Add member" aria-label="Add member">
                      <PeopleIcon size={15} />
                    </button>
                  </div>
                </div>
                {TEAM.map((m) => (
                  <div className="panel-row" key={m.handle}>
                    <span className={`p-av ${m.av}`}></span>
                    <span className="row-body">
                      <strong>{m.name}</strong>
                      <small>{m.handle}</small>
                    </span>
                    {m.role && <Tag variant="orange">{m.role}</Tag>}
                  </div>
                ))}
              </div>

              <div className="panel reveal" style={{ animationDelay: ".2s" }}>
                <div className="panel-head">
                  <h2>Organization</h2>
                </div>
                <div className="panel-body">
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
      </div>
    </section>
  );
}
