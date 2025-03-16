function initEmojiSearch(emojiData) {
    const splitter = new GraphemeSplitter();
    
    // 解析emoji数据
    function loadEmojis() {
        const emojis = emojiData.split('\n')
            .filter(line => line.trim())
            .map(line => {
                if (line.startsWith(':(') || line.startsWith(':)') || line.startsWith(':D')) {
                    const [keyword, emojis] = line.split(' : ').map(s => s.trim());
                    return { keyword, emojis };
                } else {
                    const [keyword, emojis] = line.split(':').map(s => s.trim());
                    return { keyword, emojis };
                }
            });
        return emojis;
    }

    // 渲染函数
    function renderEmojis(emojiList, searchTerm = '') {
        const container = document.getElementById('emojiList');
        container.innerHTML = '';
        
        const columns = Array.from({ length: 4 }, () => {
            const column = document.createElement('div');
            column.className = 'column';
            container.appendChild(column);
            return column;
        });
        
        const EMOJIS_PER_ROW = 13;
        const SINGLE_ROW_HEIGHT = 32;
        const PADDING = 24;
        const KEYWORD_HEIGHT = 22;

        let columnIndex = 0;

        emojiList
            .filter(({keyword}) => 
                keyword.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .forEach(({keyword, emojis}) => {
                const emojiCount = splitter.splitGraphemes(emojis).length;
                const contentRows = Math.floor(emojiCount / EMOJIS_PER_ROW) + (emojiCount % EMOJIS_PER_ROW > 0 ? 1 : 0);
                const height = KEYWORD_HEIGHT + (SINGLE_ROW_HEIGHT * contentRows) + PADDING;

                const div = document.createElement('div');
                div.className = 'emoji-item';
                div.style.height = `${height}px`;
                div.innerHTML = `
                    <div class="keyword">${keyword}</div>
                    <div class="emojis">${emojis}</div>
                `;

                columns[columnIndex].appendChild(div);
                columnIndex = (columnIndex + 1) % 4;
            });
    }

    // 初始化
    const emojiList = loadEmojis();
    renderEmojis(emojiList);

    // 搜索功能
    document.getElementById('searchInput').addEventListener('input', (e) => {
        renderEmojis(emojiList, e.target.value);
    });
} 