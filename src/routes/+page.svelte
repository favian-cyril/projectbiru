<script lang="ts">
	import { FileDropzone } from "@skeletonlabs/skeleton";
	import { FastAverageColor } from 'fast-average-color';
	import { browser } from '$app/environment';
	let preview: string;
	let color: string;
	let coordinates: GeolocationPosition;
	let file: File;
	const fac = new FastAverageColor();
	let loading = false;
	function onChangeHandler(e: Event): void {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			file = target.files[0];
			preview = URL.createObjectURL(target.files[0]);
			fac.getColorAsync(preview, { algorithm: 'dominant', ignoredColor: [255, 255, 255, 255]})
				.then(res => {
						color = res.hex;
				})
				.catch(e => {
						console.log(e);
				});
		}
	}
	async function handleSubmit(e: Event): Promise<void> {
		loading = true;
		
		e.preventDefault();
		const body = new FormData();
		body.append('file', file);
		body.append('filename', file.name);
		body.append('lat', coordinates.coords.latitude.toString());
		body.append('lng', coordinates.coords.longitude.toString());
		body.append('color', color);
		body.append('datetime', new Date().toLocaleDateString());
		try {
			console.log('ere');
			await fetch('/', {
					method: 'POST',
					body
			})
		} catch (error) {
			console.log(error);
			
		}
		loading = false;
	}
	if (browser) {
		navigator.geolocation.getCurrentPosition((res) => {
			coordinates = res
		})
	}
</script>
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		{#if preview}
			<img src={preview} width={300} height={150} alt="test">
			<div style={`background-color: ${color}`}>Your color is {color}</div>
		{/if}
		<FileDropzone name="file" on:change={onChangeHandler} />
		{#if preview && coordinates}
			<button type="button" class="btn bg-gradient-to-br variant-gradient-primary-secondary" on:click={handleSubmit}>Submit</button>
		{/if}
	</div>
</div>