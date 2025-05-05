import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TeamService } from './team.service';

export const teamGuard: CanActivateFn = async (route) => {
  const teamService = inject(TeamService);
  const router = inject(Router);
  const teamId = route.paramMap.get('id');

  if (!teamId) {
    await router.navigate(['/teams']);
    return false;
  }

  const team = await firstValueFrom(teamService.getTeam(teamId));
  if (!team) await router.navigate(['/teams']);
  return !!team;
};
