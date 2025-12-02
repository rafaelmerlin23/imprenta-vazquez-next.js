export const ErrorBadge = ({ messages } : { messages: string[] | string }) => {
    if (messages.length === 0) {
        return null;
    }
    return (
        <div className="rounded-md border border-red-500 bg-red-50 p-4 text-sm text-red-500">
            <ul>
                {Array.isArray(messages) ? messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                )) : <li>{messages}</li>}
            </ul>
        </div>
    );
};
