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

		// this doesn't work because the component must be already mounted, so I do it in the step:after of the step before
		/*if (type === "step:before") {
			if (index === 2) {
				console.log("Make Btn3 hidden");
				setButton3Hidden(true);
			}
		}*/
		//

		if (type === "step:after") {
			// this works as it mounts the button 3 before searching for the button target
			if (index === 1) {
				console.log("Make Btn3 visible");
				setButton3Hidden(false);
			}
			//

			// this works in this simple case, but not in case of my complex modal which opens up for only 1 step and is the closed again
			//setStepIndex((idx) => idx + 1);

			// to make sure the button 3 is mounted before searching for the target, I use a window.setTimeout to wrap the flushSync to make sure the component is already mounted
			// but this creates the flickering since in LIFECYCLE.COMPLETE and LIFECYCLE.INIT the overlay is hidden
			window.setTimeout(() => {
				flushSync(() => setStepIndex((idx) => idx + 1));
			});
			//
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
				type="button"
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
