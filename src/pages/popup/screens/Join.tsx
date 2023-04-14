import CodeInput from "../components/CodeInput";

export default function JoinScreen() {
    const join = () => {
        chrome.tabs.create({ url: "https://www.youtube.com"});
    }

    return (
        <>
            <CodeInput />
            <button class="btn" onClick={join}>Join</button>
        </>
    )
}