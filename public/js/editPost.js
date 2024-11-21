const postForm = document.querySelector("#formPost");

const error = document.querySelector("#error");
const title = document.querySelector("#title");
const summary = document.querySelector("#summary");
const cover = document.querySelector("#image");
const content = document.querySelector("#content");
const btn = document.querySelector(".btn");

async function editPost(postId) {
	this.event.preventDefault();
	btn.innerHTML = "Loading...";
	btn.disabled = true;

	// Form validation
	if (!title.value.trim() || !content.value.trim()) {
		error.className = "error";
		error.textContent = "Title and content cannot be empty.";
		btn.innerHTML = "Update";
		btn.disabled = false;
		return;
	}

	let post = new FormData();
	post.append("title", title.value);
	post.append("summary", summary.value);
	if (cover.files[0]) {
		post.append("cover", cover.files[0]);
	}
	post.append("content", content.value);

	try {
		const response = await fetch(`/post/edit/${postId}`, {
			method: "PUT",
			body: post,
		});
		const result = await response.json();

		if (!response.ok) {
			const errorMessage = result.message || "Failed to edit post";
			throw new Error(errorMessage);
		}

		alert("Post edited successfully");
		window.location.href = "/";
		return result;
	} catch (err) {
		error.className = "error";
		error.textContent = err.message;
		console.error(err);
	} finally {
		btn.innerHTML = "Update";
		btn.disabled = false;
	}
}

// Event listener
