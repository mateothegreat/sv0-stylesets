<script lang="ts">
  import { route } from "@mateothegreat/svelte5-router";
  import { Menubar } from "@sv0/components/navigation/menus/bar";
  import { navGroups } from "../routes/routes";
</script>

<Menubar.Root class="border-none">
  {#each navGroups as group}
    <Menubar.Menu>
      <Menubar.Trigger>{group.label}</Menubar.Trigger>
      <Menubar.Content>
        {#each group.components as component}
          {#if component.type === "separator"}
            <Menubar.Separator />
          {:else}
            <Menubar.Item>
              <a use:route href={component.route.path.toString()} class="w-full focus:outline-none">{component.label}</a>
            </Menubar.Item>
          {/if}
        {/each}
      </Menubar.Content>
    </Menubar.Menu>
  {/each}
</Menubar.Root>
