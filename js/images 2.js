// // Get the modal
// var modal = document.getElementById('myModal');
//
// // Get the image and insert it inside the modal - use its "alt" text as a caption
// var img = $('.imageModal');
// var modalImg = $("#img01");
// var captionText = document.getElementById("caption");
// $('.imageModal').click(function(){
//     modal.style.display = "block";
//     var newSrc = this.src;
//     modalImg.attr('src', newSrc);
//     captionText.innerHTML = this.alt;
// });
//
// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];
//
// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }


$(document).on('click', '[data-toggle="lightbox"]', function(event) {
                event.preventDefault();
                $(this).ekkoLightbox();
  });
