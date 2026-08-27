<script lang="ts">
  import { Badge } from "@sv0/components/display/badge";
  import Menu from "./components/nav-menu.svelte";
  import Router from "./routes/router.svelte";
</script>

<div class="h-screen flex flex-col bg-slate-900/5">
  <div class="bg-black gap-4 border-b-2 border-zinc-200 dark:border-slate-800/75 flex justify-between items-center p-2">
    <div class="text-emerald-400 font-medium">
      <Badge variant="outline" class="text-fuchsia-500">@sv0/components</Badge>
    </div>
    <div class="flex flex-1 gap-2">
      <Menu />
    </div>
    <div class="flex gap-2">
      <button class="text-emerald-400 font-medium">Light</button>
      <button class="text-emerald-400 font-medium">Dark</button>
    </div>
  </div>
  <div class="flex-1 m-3">
    <Router />
  </div>
</div>
