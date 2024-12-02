import { cn } from "~/utils/cn";

const LoadingSpinner = (props: {circleSize?: string, size?: boolean}) => {
const circle = cn("absolute animate-spin rounded-full border-t-4 border-b-4 border-purple-500", !props.circleSize ? "h-32 w-32" : props.circleSize);
const container = cn("relative flex justify-center items-center", !props.size && "h-28 w-28");

return (
<div className={container}>
    <div className={circle}></div>
    <img src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"  className="rounded-full" />
</div>
);
}

export default LoadingSpinner;