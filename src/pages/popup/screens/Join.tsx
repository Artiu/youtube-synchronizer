import CodeInput from "../components/CodeInput";

export default function JoinScreen() {
    let code = "";

    const updateCode = (newCode: string) => {
        code = newCode;
    };

    const join = async () => {
        chrome.runtime.sendMessage({ type: "startReceiving", joinCode: code });
    };

    return (
        <>
            <CodeInput updateCode={updateCode} />
            <button class="btn" onClick={join}>
                Join
            </button>
        </>
    );
}
