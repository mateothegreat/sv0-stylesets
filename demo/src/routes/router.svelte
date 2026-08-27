<script lang="ts">
  import { Router, type RouterInstance } from "@mateothegreat/svelte5-router";
  import { routes } from "./routes";

  let instance: RouterInstance;
</script>

<div class="flex flex-col gap-2">
  {#if instance?.current?.route.props}
    <div class="flex flex-col">
      <div class="text-lg font-medium text-indigo-500">
        {instance?.current?.route.props.label}
      </div>
      <div class="text-slate-500">
        {instance?.current?.route.props.description}
      </div>
    </div>
  {/if}
  <div class="dark:bg-black rounded-sm p-4 border-2 border-zinc-200 dark:border-slate-800/50">
    <Router bind:instance {routes} />
  </div>
</div>
