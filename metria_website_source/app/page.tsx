const workflow = [
  {
    step: "01",
    title: "Capture the case",
    body: "Bring interview notes, transcripts, recordings, observations, and supporting documents into one structured review packet.",
  },
  {
    step: "02",
    title: "Apply expert protocols",
    body: "Use psychologist-authored rubrics to define what matters, what counts as counterevidence, and when reviewers should defer.",
  },
  {
    step: "03",
    title: "Calibrate reviewer judgment",
    body: "Compare reviewer decisions against expert examples, track disagreement, and surface the evidence behind each call.",
  },
  {
    step: "04",
    title: "Ship a defensible outcome",
    body: "Create a decision record with evidence, uncertainty, reviewer action, and protocol version attached.",
  },
];

const psychologistLoop = [
  "Psychologists define the review rubric, red flags, neutral examples, and evidence standards.",
  "Reviewers apply the rubric inside the product instead of improvising from scattered notes.",
  "Disagreements are routed back into calibration sets so the protocol improves over time.",
  "Every final outcome carries the protocol version and expert review history that shaped it.",
];

const products = [
  {
    title: "Review Packets",
    body: "A single workspace for case material, key evidence, uncertainty, and final reviewer action.",
  },
  {
    title: "Protocol Builder",
    body: "Configurable psychologist-authored criteria for interviews, assessments, and complex human cases.",
  },
  {
    title: "Calibration Console",
    body: "Expert examples, reviewer agreement, drift signals, and quality checks in one operational view.",
  },
  {
    title: "Decision Ledger",
    body: "Exportable records that show what was considered, what was missing, and why an outcome was reached.",
  },
];

const useCases = [
  {
    title: "Clinical intake review",
    body: "Help supervision teams standardize how complex interview signals are reviewed before escalation.",
  },
  {
    title: "Assessment integrity",
    body: "Give universities and testing providers a defensible review layer for oral exams and interviews.",
  },
  {
    title: "Workplace case review",
    body: "Structure sensitive case evidence, reviewer notes, and final actions for HR and compliance teams.",
  },
  {
    title: "Research quality control",
    body: "Turn expert coding protocols into repeatable review workflows across multimodal datasets.",
  },
];

const trustItems = [
  "Expert protocol versioning",
  "Reviewer agreement tracking",
  "Evidence and counterevidence logs",
  "Missing-information flags",
  "Decision exports for audit",
  "Human review before outcome",
];

export default function Home() {
  return (
    <main>
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Metria home">
          <span className="brand-mark">M</span>
          <span>Metria</span>
        </a>
        <nav>
          <a href="#product">Product</a>
          <a href="#experts">Experts</a>
          <a href="#use-cases">Use cases</a>
          <a href="#pilot">Pilot</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Review systems for high-stakes decisions</p>
          <h1>Turn complex cases into defensible outcomes.</h1>
          <p className="hero-lede">
            Metria helps teams review interviews, assessments, and sensitive
            case material with psychologist-guided protocols, calibrated
            reviewers, and decision records that stand up to scrutiny.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="mailto:filo.cenacchi@gmail.com">
              Request a pilot
            </a>
            <a className="button secondary" href="#product">
              See the product
            </a>
          </div>
          <div className="customer-strip" aria-label="Intended customer teams">
            <span>Clinical supervision</span>
            <span>Assessment teams</span>
            <span>Case governance</span>
            <span>Research operations</span>
          </div>
        </div>

        <div className="product-shell" aria-label="Metria product preview">
          <div className="shell-top">
            <span>Review packet</span>
            <strong>Ready for decision</strong>
          </div>
          <div className="shell-grid">
            <div className="case-panel">
              <span>Case evidence</span>
              <div className="evidence-line wide"></div>
              <div className="evidence-line"></div>
              <div className="evidence-line short"></div>
              <div className="source-tags">
                <small>Transcript</small>
                <small>Observation</small>
                <small>Audio</small>
              </div>
            </div>
            <div className="rubric-panel">
              <span>Expert protocol</span>
              <div className="rubric-row strong"></div>
              <div className="rubric-row"></div>
              <div className="rubric-row"></div>
              <div className="rubric-score">
                <i></i>
                <i></i>
                <i className="muted"></i>
                <i></i>
              </div>
            </div>
            <div className="outcome-panel">
              <span>Outcome</span>
              <strong>defer for additional evidence</strong>
              <p>Reviewer agreement improved after protocol calibration.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section narrative">
        <p className="section-kicker">The category</p>
        <div className="narrative-grid">
          <h2>Important decisions are still reviewed with spreadsheets, notes, and memory.</h2>
          <p>
            That breaks down when a case depends on conversation context,
            behavioral observations, contradictory evidence, and human judgment.
            Metria gives teams a review system that treats expertise as
            infrastructure: protocols are explicit, reviewers are calibrated,
            and decisions come with a record.
          </p>
        </div>
      </section>

      <section className="section product" id="product">
        <div className="section-heading">
          <p className="section-kicker">Product</p>
          <h2>The operating system for expert review.</h2>
          <p>
            Metria is not another dashboard of scores. It is a workflow for
            turning raw case material into expert-guided review packets and
            defensible outcomes.
          </p>
        </div>
        <div className="product-grid">
          {products.map((item) => (
            <article className="product-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section workflow-section">
        <div className="section-heading">
          <p className="section-kicker">How it works</p>
          <h2>From raw case material to a decision record.</h2>
        </div>
        <div className="workflow">
          {workflow.map((item) => (
            <article className="workflow-step" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section experts" id="experts">
        <div className="expert-panel">
          <div>
            <p className="section-kicker">Psychologist-guided review</p>
            <h2>Expert judgment becomes a repeatable system.</h2>
            <p>
              Psychologists are integrated where they matter most: protocol
              design, example review, disagreement resolution, and calibration.
              The product helps teams apply expert standards consistently across
              every case.
            </p>
          </div>
          <div className="expert-loop">
            {psychologistLoop.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section use-cases" id="use-cases">
        <div className="section-heading">
          <p className="section-kicker">Where it starts</p>
          <h2>Focused enough for pilots. Broad enough to become a platform.</h2>
        </div>
        <div className="use-case-grid">
          {useCases.map((item) => (
            <article className="use-case-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section trust">
        <div className="section-heading">
          <p className="section-kicker">Why it works</p>
          <h2>Trust comes from process, not just prediction.</h2>
          <p>
            The product is designed around the operating details that serious
            organizations ask for before adopting decision software: who defined
            the standard, who reviewed the case, where disagreement appeared,
            and what evidence was missing.
          </p>
        </div>
        <div className="trust-grid">
          {trustItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="pilot" id="pilot">
        <div>
          <p className="section-kicker">Pilot program</p>
          <h2>Start with one review workflow that already matters.</h2>
          <p>
            Metria is built for teams that need a better way to handle complex
            human evidence: clinical supervision, assessment review, sensitive
            case operations, and research quality control.
          </p>
        </div>
        <div className="pilot-card">
          <strong>Private pilot intake</strong>
          <span>Define protocol</span>
          <span>Review 25-100 cases</span>
          <span>Measure agreement and deferral quality</span>
          <a href="mailto:filo.cenacchi@gmail.com">filo.cenacchi@gmail.com</a>
        </div>
      </section>

      <footer>
        <span>Metria</span>
        <span>Review systems for high-stakes decisions</span>
      </footer>
    </main>
  );
}
