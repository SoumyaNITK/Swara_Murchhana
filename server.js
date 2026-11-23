const express = require('express');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const app = express();
const SONGS_DIR = path.join(__dirname, 'songs');

app.set('view engine', 'ejs');

function getAllSongs() {
  if (!fs.existsSync(SONGS_DIR)) fs.mkdirSync(SONGS_DIR);
  return fs.readdirSync(SONGS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const slug = file.replace('.md', '');
      const raw = fs.readFileSync(path.join(SONGS_DIR, file), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug,
        name: data.Name || slug,
        singer: data.Singer || '',
        composer: data.Composer || '',
        lyricist: data.Lyricist || '',
        movie: data.Movie || '',
        rawLyrics: content
      };
    });
}

app.get('/', (req, res) => {
  const songs = getAllSongs();
  const singers = [...new Set(songs.map(s => s.singer).filter(Boolean))];
  res.render('index', { songs, singers });
});

app.get('/song/:slug', (req, res) => {
  const filePath = path.join(SONGS_DIR, `${req.params.slug}.md`);
  if (!fs.existsSync(filePath)) return res.status(404).send('404');

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const cleanContent = content.trim() ? content : '';
  const lyricsHtml = marked.parse(cleanContent, { breaks: true });

  res.render('song', { song: data || {}, lyricsHtml, slug: req.params.slug });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`⚡ Running at http://localhost:${PORT}`));