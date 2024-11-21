//  To delete a post
async function deletePost(postId) {
	try {
		const response = await fetch(`/post/${postId}`, {
			method: "DELETE",
		});
		const data = await response.json();
		if (response.status == 200) {
			console.log("Post delete successfully");
			window.location.href = "/";
			console.log("Post deleted:", data);
			return response.json();
		} else {
			throw new Error("Failed to delete post");
		}
	} catch (error) {
		alert(error);
		console.error("Error:", error);
	}
}
