// Chat presentation cleanup shared by pane teardown, route switches, and tests.
import { resetChatComposerState } from "./components/chat-composer.ts";
import { resetChatThreadPresentationState } from "./components/chat-thread.ts";

export function resetChatViewState(paneId?: string, owner?: ParentNode) {
  resetChatComposerState(paneId);
  resetChatThreadPresentationState(paneId, owner);
}
