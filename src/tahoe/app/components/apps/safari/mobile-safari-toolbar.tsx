import { SafariToolbarProps } from "./safari-toolbar";
import AddressBar from "./address-bar";
import Symbol from "../../symbol";

export default function MobileSafariToolbar(props: SafariToolbarProps) {
  const controls = [
    {
      label: "Back",
      symbol: "chevron-left",
      action: props.onBack,
      disabled: !props.canGoBack,
    },
    {
      label: "Forward",
      symbol: "chevron-right",
      action: props.onForward,
      disabled: !props.canGoForward,
    },
    {
      label: "Share",
      symbol: "square-and-arrow-up",
      action: props.onShare,
      disabled: !props.url,
    },
    {
      label: "Favorites",
      symbol: "list-bullet",
      action: props.onToggleSidebar,
    },
    { label: "Tabs", symbol: "square-on-square", action: props.onShowTabs },
  ];
  return (
    <footer className="mobile-safari-toolbar">
      <AddressBar
        ref={props.addressRef}
        url={props.url}
        isLoading={props.isLoading}
        onSubmit={props.onNavigate}
        onReload={props.onReload}
        onStop={props.onStop}
      />
      <nav aria-label="Safari controls">
        {controls.map((control) => (
          <button
            key={control.label}
            aria-label={control.label}
            disabled={control.disabled}
            onClick={control.action}
          >
            <Symbol name={control.symbol} className="w-5 h-5" />
          </button>
        ))}
      </nav>
    </footer>
  );
}
