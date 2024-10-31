const baseUrl = window.sqlViewerConfig.path;

export const fetchTables = async () => {
    const response = await fetch(`${baseUrl}/tables`);
    if (!response.ok) {
        throw new Error('Ошибка при загрузке таблиц');
    }
    const data = await response.json();
    return data.tables;
};

export const fetchQuery = async (sql: string) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const response = await fetch(`${baseUrl}/execute`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken || '',
        },
        body: JSON.stringify({ query: sql }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка выполнения запроса');
    }
    return await response.json();
};
