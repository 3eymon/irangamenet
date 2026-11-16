
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useSearchQueryParam(key = "q") {
    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get(key) ?? "";
    const [inputValue, setInputValue] = useState<string | null>(null);

    const value = inputValue ?? query;

    const update = useCallback(
        (next: string) => {
            if (next === query) return;

            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);

                if (next) params.set(key, next);
                else params.delete(key);

                return params;
            });
        },
        [key, query, setSearchParams],
    );

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;

        setInputValue(next);

        if (next.trim() === "") {
            update("");
        }
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        (document.activeElement as HTMLElement | null)?.blur();

        update(value.trim());
        setInputValue(null);
    };

    const clear = () => {
        setInputValue("");
        update("");
    };

    return { query, value, onChange, submit, clear };
}
