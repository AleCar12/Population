// Materialize Parallax
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.parallax');
    var instances = M.Parallax.init(elems, 0);
});

// Materialize Select menu
$(document).ready(function () {
    $('select').formSelect();
});