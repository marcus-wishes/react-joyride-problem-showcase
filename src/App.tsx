import { useCallback, useState } from "react";
import { flushSync } from "react-dom";
import type { CallBackProps, Step } from "react-joyride";
import ReactJoyride from "react-joyride";

function Button({
  hidden = false,
  id,
  ...props
}: { hidden?: boolean } & React.HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...props}
	  type="button"
      id={id}
      style={{
        display: hidden ? "none" : "block",
      }}
    >
      {id}
    </button>
  );
}

const steps: Step[] = [
  {
    title: "Step 1",
    target: "#btn1",
    content: "this is btn1",
  },
  {
    title: "Step 2",
    target: "#btn2",
    content: "this is btn2",
  },
  {
    title: "Step 3",
    target: "#btn3",
    content: "This is btn3",
  },
  {
    title: "Step 4",
    target: "#btn4",
    content: "This is btn4",
  },
];

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [run, setRun] = useState(false);
  const [btn3Hidden, setButton3Hidden] = useState(false);

  const cb = useCallback((joyrideState: CallBackProps) => {
    const { index, type } = joyrideState;
    console.log("CB", type, index);
    if (type === "step:after") {
      
	  if (index === 1) {
        console.log("Make Btn3 visible");
        setButton3Hidden(false);
      }
	  window.setTimeout(() => {
		flushSync(
      		() => setStepIndex((idx) => idx + 1)
		);
	  })

    } else if (type === "tour:start") {
      setStepIndex(0);
      setButton3Hidden(true);
    } else if (type === "error") {
      setStepIndex(0);
      setButton3Hidden(false);
      setRun(false);
    } else if (type === "tour:end") {
      setStepIndex(0);
      setButton3Hidden(false);
      setRun(false);
    }
  }, []);

  return (
    <>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Button id="btn1" />
        <Button id="btn2" />
        <Button id="btn3" hidden={btn3Hidden} />
        <Button id="btn4" />
      </div>
      <ReactJoyride
        continuous
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        callback={cb}
      />
      <button
        onClick={() => {
          setButton3Hidden(true);
          setRun(true);
        }}
      >
        start
      </button>
    </>
  );
}
