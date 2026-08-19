"use client";

import Image from "next/image";
import { useState } from "react";
import Header from "../components/Header/header";
import Footer from "../components/Footer/footer";
import "./codingLabs.css";

const practiceItems = [
  { label: "Write & test code", color: "#BF1869" },
  { label: "Solve real challenges", color: "#2A7308" },
  { label: "Explore coding solutions", color: "#67096E" },
  { label: "Build practical projects", color: "#2D4CC8" },
];

const challengeCards = [
  {
    title: "Apply concepts",
    text: "Apply coding concepts through guided exercises.",
    icon: "/icons/codepen.svg",
    tone: "pink",
  },
  {
    title: "Problem-solving",
    text: "Improve logical thinking through guided challenges.",
    icon: "/icons/brain-cog.svg",
    tone: "teal",
  },
  {
    title: "Code efficiently",
    text: "Learn cleaner and more effective coding techniques.",
    icon: "/icons/brace.png",
    tone: "purple",
  },
  {
    title: "Interview-ready",
    text: "Build confidence for coding tests and technical assessments.",
    icon: "/icons/checkmark-circle-02.svg",
    tone: "blue",
  },
];

const skillItems = [
  { label: "Write clean, efficient code", color: "#2A7308" },
  { label: "Debug and fix programs", color: "#BF1869" },
  { label: "Strengthen programming logic", color: "#67096E" },
  { label: "Build real-world solutions", color: "#2D4CC8" },
];

const sliderVideos = [
  "/videos/first.mp4",
  "/videos/second.mp4",
  "/videos/third.mp4",
];

function CheckIcon({ color }: { color: string }) {
  return (
    <svg
      className="coding-check-icon"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M24 4.24813C22.1626 3.44535 20.1333 3 18 3C9.71572 3 3 9.71572 3 18C3 26.2842 9.71572 33 18 33C26.2842 33 33 26.2842 33 18C33 17.4937 32.9749 16.9934 32.9259 16.5"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15.75L17.25 21L33 6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CodingLabsPage() {
  const [videoOrder, setVideoOrder] = useState([0, 1, 2]);

  // Nothing is selected initially:
  // both CTA buttons start raised with blue text.
  const [activeCta, setActiveCta] =
    useState<"demo" | "started" | null>(null);

  const previousVideo = () => {
    setVideoOrder((current) => [current[2], current[0], current[1]]);
  };

  const nextVideo = () => {
    setVideoOrder((current) => [current[1], current[2], current[0]]);
  };

  return (
    <>
      <Header />
      <main className="coding-page">
      <div className="coding-shell">
        <nav className="coding-breadcrumb" aria-label="Breadcrumb">
          <span>Neuro Labs</span>
          <Image
            src="/icons/arrow-right-double.svg"
            width={16}
            height={16}
            alt=""
            aria-hidden="true"
          />
          <strong aria-current="page">Coding Labs</strong>
        </nav>

        <section className="coding-hero">
          <div className="coding-hero__inner">
            <div className="coding-hero__content">
              <span className="coding-pill">Coding Mastery</span>
              <h1>Practice! Build! and Master Coding Skills</h1>
              <p>Practice, solve challenges, and master coding hands-on.</p>
            </div>

            <div className="coding-hero__visual">
              <Image
                src="/images/image.png"
                width={740}
                height={521}
                alt="Coding learner using a laptop"
                priority
              />
            </div>
          </div>
        </section>

        <section className="coding-section coding-practice">
          <div className="coding-section-copy">
            <span className="coding-pill">Learn by Coding</span>
            <h2>
  Master Coding with
  <br />
  Hands-On Practice
</h2>

<p>
  Practice programming through interactive coding
  <br />
   labs that turn concepts into real-world skills.
</p>
          </div>

          <div className="coding-practice-card">
            <div className="coding-practice-card__inner">
              {practiceItems.map((item) => (
                <div className="coding-practice-row" key={item.label}>
                  <CheckIcon color={item.color} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="coding-challenges">
          <div className="coding-challenges__intro">
            <span className="coding-pill coding-pill--wide">What Learners Gain</span>
            <h2>Interactive Coding Challenges</h2>
            <p>Learn by building, solving, and improving with every challenge.</p>
          </div>

          <div className="coding-challenge-grid">
            {challengeCards.map((card) => (
              <article
                className={`coding-challenge-card coding-challenge-card--${card.tone}`}
                key={card.title}
              >
                <div className="coding-challenge-card__copy">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
                <div className="coding-challenge-card__icon">
                  <Image src={card.icon} width={42} height={42} alt="" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="coding-section coding-skills">
          <div className="coding-skill-list">
            {skillItems.map((item) => (
              <div
                className="coding-skill-item"
                style={{ "--skill-color": item.color } as React.CSSProperties}
                key={item.label}
              >
                <Image
                  src="/icons/checkmark-badge-01.svg"
                  width={36}
                  height={36}
                  alt=""
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="coding-section-copy">
            <span className="coding-pill">Code Smarter</span>
            <h2>Real-World Skill Development</h2>
            <p>
              Coding Labs simulate real-world development, helping learners
              solve practical programming challenges.
            </p>
          </div>
        </section>

        <section className="coding-section coding-learning">
          <div className="coding-section-copy">
            <span className="coding-pill">Flexible Learning</span>
            <h2>Built for Every<br />Learning Environment</h2>
            <p>
              Perfect for universities, bootcamps, corporate training, and
              online coding programs.
            </p>
          </div>

          <div className="coding-video-area">
            <div className="coding-video-deck">
              <div className="coding-video-card coding-video-card--back">
                <video
                  key={`back-${videoOrder[2]}`}
                  className={videoOrder[2] === 0 ? "coding-first-video" : undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={sliderVideos[videoOrder[2]]} type="video/mp4" />
                </video>
              </div>

              <div className="coding-video-card coding-video-card--middle">
                <video
                  key={`middle-${videoOrder[1]}`}
                  className={videoOrder[1] === 0 ? "coding-first-video" : undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={sliderVideos[videoOrder[1]]} type="video/mp4" />
                </video>
              </div>

              <div className="coding-video-card coding-video-card--front">
                <video
                  key={`front-${videoOrder[0]}`}
                  className={videoOrder[0] === 0 ? "coding-first-video" : undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={sliderVideos[videoOrder[0]]} type="video/mp4" />
                </video>
              </div>
            </div>

            <div className="coding-video-controls">
              <button type="button" onClick={previousVideo} aria-label="Previous video">
                <Image
                  src="/icons/arrow-left-02.svg"
                  width={32}
                  height={32}
                  alt=""
                />
              </button>
              <button type="button" onClick={nextVideo} aria-label="Next video">
                <Image
                  src="/icons/arrow-right-02.svg"
                  width={32}
                  height={32}
                  alt=""
                />
              </button>
            </div>
          </div>
        </section>

        <section className="coding-cta">
          <Image
            className="coding-cta__background"
            src="/icons/background coding labs.png"
            width={1280}
            height={505}
            alt=""
          />

          <div className="coding-cta__content">
            <h2>NeuroLabs Coding Labs Learn by Coding</h2>
            <p>
              Build real-world coding skills through hands on practice and
              interactive challenges.
            </p>

            <div className="coding-cta__actions">
              <button
                type="button"
                className={activeCta === "demo" ? "is-selected" : ""}
                onClick={() => setActiveCta("demo")}
                onMouseLeave={() => setActiveCta(null)}
                onBlur={() => setActiveCta(null)}
                aria-pressed={activeCta === "demo"}
              >
                Book a Demo
              </button>

              <button
                type="button"
                className={activeCta === "started" ? "is-selected" : ""}
                onClick={() => setActiveCta("started")}
                onMouseLeave={() => setActiveCta(null)}
                onBlur={() => setActiveCta(null)}
                aria-pressed={activeCta === "started"}
              >
                Get Started
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>

    <Footer />
  </>
  );
}
