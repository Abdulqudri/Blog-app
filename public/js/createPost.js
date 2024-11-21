// To create a new post

const postForm = document.querySelector("#formPost");

const error = document.querySelector("#error");
const title = document.querySelector("#title");
const summary = document.querySelector("#summary");
const cover = document.querySelector("#image");
const content = document.querySelector("#content");
const btn = document.querySelector("#btn");

async function submitPost(e) {
	e.preventDefault();
	btn.innerHTML = "Loading...";
	btn.disabled = true;

	const post = new FormData();
	post.append("title", title.value);
	post.append("summary", summary.value);
	post.append("cover", cover.files[0]);
	post.append("content", content.value);

	try {
		const response = await fetch("/post/newpost", {
			method: "POST",
			body: post,
		});
		const result = await response.json();

		if (!response.ok) {
			throw new Error("Failed to upload new post");
		}
		alert("Post uploaded successfully");
		window.location.href = "/";
		return result;
	} catch (err) {
		error.className = "error";
		error.textContent = err.message;
		console.log(err);
	} finally {
		btn.innerHTML = "Submit";
		btn.disabled = false;
	}
}

postForm.addEventListener("submit", submitPost);
