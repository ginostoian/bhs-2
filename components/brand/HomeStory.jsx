import Image from "next/image";
import styles from "./HomeStory.module.css";

export function HomeLiving() {
  return (
    <section className="bh-band" aria-labelledby="home-living-title">
      <div className={`bh-wrap bh-section ${styles.living}`}>
        <figure className={styles.photo}>
          <Image
            src="/assets/portfolio/extension-ava-e7/side-return-extension-1.webp"
            alt="Daylight falling into a completed kitchen and dining space in E7"
            width={900}
            height={1100}
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          <figcaption>
            <a href="/portfolio/ava-e7">
              A kitchen made for everyday life, E7 →
            </a>
          </figcaption>
        </figure>
        <div>
          <p className="bh-eyebrow">More from the home you love</p>
          <h2 id="home-living-title" className="bh-heading">
            Room for the moments that make it yours.
          </h2>
          <p className="bh-lead">
            You know the things you would change. The kitchen that feels
            crowded. The dark corner. The bags that never quite find a home. A
            good renovation starts there.
          </p>
          <div className={styles.moments}>
            {[
              [
                "A kitchen that brings you together",
                "Space to cook while someone tells you about their day. A table you can gather around, on an ordinary Tuesday or when friends stay for dinner.",
              ],
              [
                "A brighter place to spend your time",
                "Daylight reaching further into the house. A view of the garden from your favourite chair. Rooms you want to settle into, whatever the season.",
              ],
              [
                "A little more ease, every day",
                "Storage where you need it. Room to move past each other. A place to work, unwind or welcome someone for the weekend.",
              ],
            ].map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeHow() {
  return (
    <section
      id="how"
      className="bh-wrap bh-section"
      aria-labelledby="home-how-title"
    >
      <div className="bh-grid-two">
        <div>
          <p className="bh-eyebrow">Getting there, together</p>
          <h2 id="home-how-title" className="bh-heading">
            A big change to your home. A clear way forward.
          </h2>
        </div>
        <div>
          <p className="bh-lead">
            Bring your own architect or choose one we recommend. They draw, we
            build. If you wish, we can look after the conversations between
            everyone, leaving you less to organise and clear choices to make.
          </p>
          <p className={styles.link}>
            <a href="/about#design-and-build" className="bh-text-link">
              Choose the support that suits you →
            </a>
          </p>
        </div>
      </div>
      <ol className={styles.steps}>
        {[
          [
            "Start with your everyday",
            "Tell us what works, what frustrates you and what you would love to change. We listen, talk through your budget and help you find a sensible next step.",
          ],
          [
            "Know what to expect",
            "Before building begins, you receive a detailed quote and a clear plan. You choose what feels right for your home and agree the cost.",
          ],
          [
            "Feel looked after",
            "Your project lead updates you each week. If something needs a decision, we explain your options. We check the finishing details together before handing your home back.",
          ],
        ].map(([title, text], i) => (
          <li key={title}>
            <span className="bh-eyebrow">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function HomeAftercare() {
  return (
    <div className="bh-grid-two">
      <div>
        <p className="bh-eyebrow">Once you are home</p>
        <h2 className="bh-heading">
          Someone to turn to, even after the work is done.
        </h2>
      </div>
      <div>
        <p className="bh-lead">
          Settling into your finished home should feel good. If a question comes
          up, you have a clear aftercare contact. Our workmanship cover is ten
          years for extensions and lofts, two for kitchens and bathrooms, and
          one for decorating.
        </p>
        <p className={styles.link}>
          <a href="/our-guarantee" className="bh-text-link">
            Read about your workmanship cover →
          </a>
        </p>
      </div>
    </div>
  );
}
