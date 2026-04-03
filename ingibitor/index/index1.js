const media = window.matchMedia('(max-width: 768px)');
function Class(e) {
    const el = document.querySelector('div');
    if (e.matches) {
        el.classList.remove('b');
    } else {
        el.classList.add('b');
    }
}
Class(media);
media.addEventListener('change', Class);

document.getElementById('pl').addEventListener('click', function(){
    const pol1 = document.getElementById('po');
    pol1.classList.remove('nowid');
});
document.getElementById('close').addEventListener('click', function(){
    const pol1 = document.getElementById('po');
    pol1.classList.add('nowid');
});
document.getElementById('tren').addEventListener('click', function(){
    const pol1 = document.getElementById('po2');
    pol1.classList.remove('nowid');
});
document.getElementById('tren1').addEventListener('click', function(){
    const pol1 = document.getElementById('po2');
    pol1.classList.remove('nowid');
});
document.getElementById('close2').addEventListener('click', function(){
    const pol1 = document.getElementById('po2');
    pol1.classList.add('nowid');
});