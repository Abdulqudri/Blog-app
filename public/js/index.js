const btn = document.querySelector("#btn")
const postForm = document.querySelector("#postForm");
const title = document.querySelector("#title");
const summary = document.querySelector("#summary");
const cover = document.querySelector("#image");
const content = document.querySelector("#content");

const submitPost = (e) => {
	e.preventDefault();
  alert("inside function")
	const post = new FormData();
	post.append('title', title.value);
	post.append('summary', summary.value);
	post.append('cover', cover.files[0]); // Attach the file from the file input
	post.append('content', content.value);

	console.log(post); // This will log the FormData object, but you won't see the values in the console directly

	fetch("/post/new", {
		method: "POST",
		body: post
	})
		.then((res) => res.json())
		.then((data) => console.log(data));
}

postForm.addEventListener("submit", submitPost);
postForm.addEventListener("click", (e) => {
	e.preventDefault();
	e.target.style.color = "red";
})