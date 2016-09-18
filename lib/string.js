const escapeHtml = (unsafe) => unsafe.replace(/&/g, '&amp;')
     .replace(/</g, '&lt;')
     .replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;')
     .replace(/'/g, '&#039;');

const truncate = (str, len) => str.substr(0, len) + (str.length > len ? '...' : '');

const clean = (str) => str.replace(/\s+/g, ' ').trim();

const excerpt = (str, len) => truncate(clean(str), len);

module.exports = {
    escapeHtml,
    excerpt
};
