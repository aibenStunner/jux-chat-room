import { cx } from "class-variance-authority";
import { useLivePosts } from "../rooms/[roomId]/hooks";
import { run } from "./utils";

export function SubscriptionStatus(props: {
  subscription: ReturnType<typeof useLivePosts>["messageSubscription"];
}) {
  const { subscription } = props;
  return (
    <div
      className={cx(
        "flex flex-row space-x-1 justify-center items-center rounded-2xl px-3 py-1 text-sm font-medium transition-colors",
        run(() => {
          switch (subscription.status) {
            case "idle":
            case "connecting":
              return "bg-white text-gray-500";
            case "error":
              return "bg-red-100 text-red-800";
            case "pending":
              return "bg-emerald-100 text-emerald-800";
          }
        })
      )}
    >
      <div className="w-2 h-2 bg-current rounded-full"></div>
      {run(() => {
        switch (subscription.status) {
          case "idle":
          case "connecting":
            // treat idle and connecting the same
            return (
              <div>
                Connecting...
                {subscription.error && " (There are connection problems)"}
              </div>
            );
          case "error":
            // something went wrong
            return (
              <div>
                Error - <em>{subscription.error.message}</em>
                <a
                  href="#"
                  onClick={() => {
                    subscription.reset();
                  }}
                  className="hover underline"
                >
                  Try Again
                </a>
              </div>
            );
          case "pending":
            // we are polling for new messages
            return <div>Connected</div>;
        }
      })}
    </div>
  );
}
