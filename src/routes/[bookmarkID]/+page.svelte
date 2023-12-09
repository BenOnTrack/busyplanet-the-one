<script>
	import { bookmarkdb } from  '$lib/bookmarks/bookmarkdb';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	export let data;
	$: ({ bookmark } = data);

	$: handleSubmit = () => {
		try {
			bookmarkdb.ids.update(bookmark.id, { ...bookmark });
			goto(`${base}/`);
		} catch (err) {
			console.log(err);
		}
	};
</script>

<section class="container text-slate-500 mx-auto px-5 ">
	<div class="flex flex-col justify-center items-center min-h-[30rem]">
		<h1 class="text-4xl my-4">Editing {bookmark.name}</h1>
		<form
			on:submit|preventDefault={handleSubmit}
			class="flex flex-wrap gap-3 max-w-lg"
			method="POST"
		>
			<input
				class="focus:outline-none p-3 rounded-sm w-full ring-2"
				placeholder="description..."
				bind:value={bookmark.description}
				type="text"
			/>
			<button type="submit" class="px-4 py-2 bg-slate-700 text-white rounded-sm">Update Bookmark description</button
			>
		</form>
	</div>
</section>