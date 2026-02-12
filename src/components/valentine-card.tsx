import { useRef, useState, useLayoutEffect } from "react";

const ORBIT_RADIUS_PX = 90;
const MIN_JUMP_RAD = (72 * Math.PI) / 180;

function getPositionOnCircle(
  centerX: number,
  centerY: number,
  radius: number,
  angleRad: number,
): { x: number; y: number } {
  return {
    x: centerX + radius * Math.cos(angleRad),
    y: centerY + radius * Math.sin(angleRad),
  };
}

export function ValentineCard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const [center, setCenter] = useState<{ x: number; y: number } | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [noIsOrbiting, setNoIsOrbiting] = useState(false);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const wr = wrapper.getBoundingClientRect();
    setCenter({ x: wr.width / 2, y: wr.height / 2 });
  }, []);

  function handleYes() {
    setAccepted(true);
  }

  function handleNo(e: React.PointerEvent) {
    e.preventDefault();
    if (!noIsOrbiting) {
      setNoIsOrbiting(true);
    }
    setAngle(
      (prev) => (prev + MIN_JUMP_RAD + Math.random() * Math.PI) % (2 * Math.PI),
    );
  }

  const noPosition = center
    ? getPositionOnCircle(center.x, center.y, ORBIT_RADIUS_PX, angle)
    : null;

  const noButtonStyle =
    noIsOrbiting && noPosition
      ? {
          position: "absolute" as const,
          left: noPosition.x,
          top: noPosition.y,
          transform: "translate(-50%, -50%)",
          transition: "left 0.3s ease-out, top 0.3s ease-out",
        }
      : undefined;

  return (
    <section className="valentine-card" aria-label="Valentine card">
      {accepted ? (
        <div className="valentine-success">
          <p className="valentine-success-message">
            Yay! Happy Valentine&apos;s Day!
          </p>
          <div className="valentine-success-heart" aria-hidden="true" />
        </div>
      ) : (
        <>
          <h1 className="valentine-question">Teo, will you be my Valentine?</h1>
          <p className="valentine-question-hint">Go on, try pressing No…</p>
          <div className="valentine-buttons" ref={wrapperRef}>
            <button
              type="button"
              className="valentine-btn valentine-btn-yes"
              onClick={handleYes}
            >
              Yes
            </button>
            {noIsOrbiting && (
              <button
                type="button"
                className="valentine-btn valentine-btn-no"
                aria-hidden="true"
                tabIndex={-1}
                disabled
                style={{ visibility: "hidden", pointerEvents: "none" }}
              >
                No
              </button>
            )}
            <button
              type="button"
              className="valentine-btn valentine-btn-no"
              onPointerDown={handleNo}
              style={noButtonStyle}
            >
              No
            </button>
          </div>
        </>
      )}
    </section>
  );
}
