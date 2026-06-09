(() => {
      const coverThemeToggle = document.querySelector("#cover-theme");
      const themeStore = {
        get() {
          try {
            return localStorage.getItem("spazioDeskCoverTheme");
          } catch {
            return null;
          }
        },
        set(value) {
          try {
            localStorage.setItem("spazioDeskCoverTheme", value);
          } catch {
            /* Theme still works when storage is unavailable. */
          }
        }
      };
      const savedCoverTheme = themeStore.get();
      const initialCoverTheme = savedCoverTheme === "black" ? "black" : "white";

      const applyCoverTheme = (theme) => {
        const nextTheme = theme === "black" ? "black" : "white";
        document.body.dataset.coverTheme = nextTheme;
        themeStore.set(nextTheme);
        if (coverThemeToggle) {
          coverThemeToggle.textContent = nextTheme === "black" ? "NERO" : "BIANCO";
          coverThemeToggle.dataset.theme = nextTheme;
          coverThemeToggle.setAttribute("aria-pressed", nextTheme === "black" ? "true" : "false");
        }
      };

      applyCoverTheme(initialCoverTheme);
      coverThemeToggle?.addEventListener("click", () => {
        applyCoverTheme(document.body.dataset.coverTheme === "black" ? "white" : "black");
      });

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (reducedMotion.matches) return;

      const sections = Array.from(document.querySelectorAll(".screen"));
      let activeIndex = 0;
      let isSnapping = false;
      let snapTimer = 0;
      let touchStartY = 0;

      const setActiveFromScroll = () => {
        activeIndex = window.scrollY < window.innerHeight * 0.5 ? 0 : 1;
      };

      const snapTo = (index) => {
        const nextIndex = Math.max(0, Math.min(sections.length - 1, index));
        if (nextIndex === activeIndex && Math.abs(window.scrollY - sections[nextIndex].offsetTop) < 3) return;

        activeIndex = nextIndex;
        isSnapping = true;
        sections[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" });

        window.clearTimeout(snapTimer);
        snapTimer = window.setTimeout(() => {
          isSnapping = false;
          setActiveFromScroll();
        }, 760);
      };

      const requestSnap = (deltaY, event) => {
        if (Math.abs(deltaY) < 4) return;
        setActiveFromScroll();

        if (deltaY > 0 && activeIndex === 0) {
          event.preventDefault();
          if (!isSnapping) snapTo(1);
        }

        if (deltaY < 0 && activeIndex === 1) {
          event.preventDefault();
          if (!isSnapping) snapTo(0);
        }
      };

      window.addEventListener("wheel", (event) => requestSnap(event.deltaY, event), { passive: false });

      window.addEventListener("touchstart", (event) => {
        touchStartY = event.touches[0].clientY;
      }, { passive: true });

      window.addEventListener("touchmove", (event) => {
        const deltaY = touchStartY - event.touches[0].clientY;
        if (Math.abs(deltaY) > 18) requestSnap(deltaY, event);
      }, { passive: false });

      window.addEventListener("keydown", (event) => {
        const downKeys = ["ArrowDown", "PageDown", " "];
        const upKeys = ["ArrowUp", "PageUp"];
        if (downKeys.includes(event.key) && activeIndex === 0) {
          event.preventDefault();
          snapTo(1);
        }
        if (upKeys.includes(event.key) && activeIndex === 1) {
          event.preventDefault();
          snapTo(0);
        }
      });

      window.addEventListener("resize", setActiveFromScroll);
      window.addEventListener("scroll", () => {
        if (!isSnapping) setActiveFromScroll();
      }, { passive: true });
    })();
