import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TRIGGER = ".scenery-scroll-element";

export function initSceneryScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    return () => {};
  }

  const speed = 100;

  const scene1 = gsap.timeline();
  ScrollTrigger.create({
    animation: scene1,
    trigger: TRIGGER,
    start: "top top",
    end: "45% 100%",
    scrub: 3,
  });

  scene1.to(
    "#h1-1",
    { y: 3 * speed, x: 1 * speed, scale: 0.9, ease: "power1.in" },
    0
  );
  scene1.to("#h1-2", { y: 2.6 * speed, x: -0.6 * speed, ease: "power1.in" }, 0);
  scene1.to("#h1-3", { y: 1.7 * speed, x: 1.2 * speed }, 0.03);
  scene1.to("#h1-4", { y: 3 * speed, x: 1 * speed }, 0.03);
  scene1.to("#h1-5", { y: 2 * speed, x: 1 * speed }, 0.03);
  scene1.to("#h1-6", { y: 2.3 * speed, x: -2.5 * speed }, 0);
  scene1.to("#h1-7", { y: 5 * speed, x: 1.6 * speed }, 0);
  scene1.to("#h1-8", { y: 3.5 * speed, x: 0.2 * speed }, 0);
  scene1.to("#h1-9", { y: 3.5 * speed, x: -0.2 * speed }, 0);

  gsap.fromTo(
    "#bird",
    { opacity: 1 },
    {
      y: -250,
      x: 800,
      ease: "power2.out",
      scrollTrigger: {
        trigger: TRIGGER,
        start: "15% top",
        end: "60% 100%",
        scrub: 4,
        onEnter: () => {
          gsap.to("#bird", { scaleX: 1, rotation: 0 });
        },
        onLeave: () => {
          gsap.to("#bird", { scaleX: -1, rotation: -15 });
        },
      },
    }
  );

  const clouds = gsap.timeline();
  ScrollTrigger.create({
    animation: clouds,
    trigger: TRIGGER,
    start: "top top",
    end: "70% 100%",
    scrub: 1,
  });

  clouds.to("#cloud1", { x: 500 }, 0);
  clouds.to("#cloud2", { x: 1000 }, 0);
  clouds.to("#cloud3", { x: -1000 }, 0);
  clouds.to("#cloud4", { x: -700, y: 25 }, 0);

  const sun = gsap.timeline();
  ScrollTrigger.create({
    animation: sun,
    trigger: TRIGGER,
    start: "top top",
    end: "2200 100%",
    scrub: 1,
  });

  sun.to("#bg_grad", { attr: { cy: "330" } }, 0);
  sun.to("#sun", { attr: { offset: "0.15" } }, 0);
  sun.to("#bg_grad stop:nth-child(2)", { attr: { offset: "0.15" } }, 0);
  sun.to("#bg_grad stop:nth-child(3)", { attr: { offset: "0.18" } }, 0);
  sun.to("#bg_grad stop:nth-child(4)", { attr: { offset: "0.25" } }, 0);
  sun.to("#bg_grad stop:nth-child(5)", { attr: { offset: "0.46" } }, 0);
  sun.to("#bg_grad stop:nth-child(6)", { attr: { "stop-color": "#FF9171" } }, 0);

  const scene2 = gsap.timeline();
  ScrollTrigger.create({
    animation: scene2,
    trigger: TRIGGER,
    start: "15% top",
    end: "40% 100%",
    scrub: 4,
  });

  scene2.fromTo("#h2-1", { y: 500, opacity: 0 }, { y: 0, opacity: 1 }, 0);
  scene2.fromTo("#h2-2", { y: 500 }, { y: 0 }, 0.1);
  scene2.fromTo("#h2-3", { y: 700 }, { y: 0 }, 0.1);
  scene2.fromTo("#h2-4", { y: 700 }, { y: 0 }, 0.2);
  scene2.fromTo("#h2-5", { y: 800 }, { y: 0 }, 0.3);
  scene2.fromTo("#h2-6", { y: 900 }, { y: 0 }, 0.3);

  gsap.fromTo(
    "#bats",
    { opacity: 1, y: 400, scale: 0 },
    {
      y: 120,
      scale: 0.8,
      transformOrigin: "50% 50%",
      ease: "power3.out",
      scrollTrigger: {
        trigger: TRIGGER,
        start: "40% top",
        end: "70% 100%",
        scrub: 3,
        onEnter: () => {
          gsap.utils.toArray<SVGPathElement>("#bats path").forEach((item, i) => {
            gsap.to(item, {
              scaleX: 0.5,
              yoyo: true,
              repeat: 11,
              duration: 0.15,
              delay: 0.7 + i / 10,
              transformOrigin: "50% 50%",
            });
          });
          gsap.set("#bats", { opacity: 1 });
        },
        onLeave: () => {
          gsap.to("#bats", { opacity: 0, delay: 2 });
        },
      },
    }
  );

  const sun2 = gsap.timeline();
  ScrollTrigger.create({
    animation: sun2,
    trigger: TRIGGER,
    start: "2200 top",
    end: "5000 100%",
    scrub: 1,
  });

  sun2.to("#sun", { attr: { offset: "0.6" } }, 0);
  sun2.to("#bg_grad stop:nth-child(2)", { attr: { offset: "0.7" } }, 0);
  sun2.to("#sun", { attr: { "stop-color": "#ffff00" } }, 0);
  sun2.to("#lg4 stop:nth-child(1)", { attr: { "stop-color": "#623951" } }, 0);
  sun2.to("#lg4 stop:nth-child(2)", { attr: { "stop-color": "#261F36" } }, 0);
  sun2.to("#bg_grad stop:nth-child(6)", { attr: { "stop-color": "#45224A" } }, 0);

  gsap.set("#scene3", { y: 580, visibility: "visible" });

  const sceneTransition = gsap.timeline();
  ScrollTrigger.create({
    animation: sceneTransition,
    trigger: TRIGGER,
    start: "70% top",
    end: "bottom 100%",
    scrub: 3,
  });

  sceneTransition.to(
    "#h2-1",
    { y: -680, scale: 1.5, transformOrigin: "50% 50%" },
    0
  );
  sceneTransition.to("#bg_grad", { attr: { cy: "-80" } }, 0);
  sceneTransition.to("#bg2", { y: 0 }, 0);

  const scene3 = gsap.timeline();
  ScrollTrigger.create({
    animation: scene3,
    trigger: TRIGGER,
    start: "80% 50%",
    end: "bottom 100%",
    scrub: 3,
  });

  scene3.fromTo("#h3-1", { y: 300 }, { y: -550 }, 0);
  scene3.fromTo("#h3-2", { y: 800 }, { y: -550 }, 0.03);
  scene3.fromTo("#h3-3", { y: 600 }, { y: -550 }, 0.06);
  scene3.fromTo("#h3-4", { y: 800 }, { y: -550 }, 0.09);
  scene3.fromTo("#h3-5", { y: 1000 }, { y: -550 }, 0.12);
  scene3.fromTo("#stars", { opacity: 0 }, { opacity: 0.5, y: -500 }, 0);
  scene3.to("#bg2-grad", { attr: { cy: 600 } }, 0);
  scene3.to("#bg2-grad", { attr: { r: 500 } }, 0);

  gsap.to("#fstar", {
    x: -700,
    y: -250,
    ease: "power4.out",
    scrollTrigger: {
      trigger: TRIGGER,
      start: "4000 top",
      end: "6000 100%",
      scrub: 5,
      onEnter: () => {
        gsap.set("#fstar", { opacity: 1 });
      },
      onLeave: () => {
        gsap.set("#fstar", { opacity: 0 });
      },
    },
  });

  ScrollTrigger.refresh();

  return () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}
