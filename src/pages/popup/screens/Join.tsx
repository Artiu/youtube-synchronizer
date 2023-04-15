import CodeInput from "../components/CodeInput";

export default function JoinScreen() {
    let code = "";

    const updateCode = (newCode: string) => {
        code = newCode;
    };

    const join = () => {
        chrome.tabs.create({ url: "https://www.youtube.com" });
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
