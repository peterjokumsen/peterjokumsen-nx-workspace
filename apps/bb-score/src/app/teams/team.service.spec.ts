import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Player, Team } from './models';
import { TeamService } from './team.service';

describe('TeamService', () => {
  let service: TeamService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    mockLocalStorage = {};
    const storage: Pick<Storage, 'getItem' | 'setItem'> = {
      getItem: jest
        .fn()
        .mockImplementation((key: string) => mockLocalStorage[key] || null),
      setItem: jest.fn().mockImplementation((key: string, value: string) => {
        mockLocalStorage[key] = value;
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Storage, useValue: storage },
        TeamService, // sut
      ],
    });
    service = TestBed.inject(TeamService);
  });

  afterEach(() => {
    // Clear mock localStorage after each test
    mockLocalStorage = {};
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty array when no saved teams exist', async () => {
    const teams = await firstValueFrom(service.getTeams());
    expect(teams).toHaveLength(0);
  });

  it('should load saved teams from localStorage', async () => {
    const player: Player = {
      id: '2',
      league: ['League', 'League2'],
      name: 'Player1',
      number: 123,
    };
    const savedTeams: Team[] = [
      {
        id: '1',
        name: 'Team A',
        location: 'Loc1',
        players: [
          player,
          {
            ...player,
            id: '3',
            name: 'Player2',
            number: 456,
            league: ['League'],
          },
        ],
      },
    ];
    mockLocalStorage['bb-score-teams'] = JSON.stringify(savedTeams);

    const teams = await firstValueFrom(service.getTeams());
    expect(teams).toHaveLength(1);
    expect(teams[0].id).toBe('1');
    expect(teams[0].name).toBe('Team A');
    expect(teams[0].leagues).toEqual(['League', 'League2']);
    expect(teams[0].location).toBe('Loc1');
    expect(teams[0].playerCount).toBe(2);
  });

  it('should create a new team and save to localStorage', async () => {
    const newTeam: Omit<Team, 'id' | 'players'> = {
      name: 'Team B',
      location: 'Loc1',
    };

    service.createTeam(newTeam);

    const teams = await firstValueFrom(service.getTeams());
    expect(teams).toHaveLength(1);
    const createdTeam = teams[0];
    expect(createdTeam.name).toBe('Team B');
    expect(createdTeam.location).toBe('Loc1');
    expect(createdTeam.playerCount).toEqual(0);
    expect(createdTeam.id).toBeDefined();

    // Verify localStorage was updated
    const savedTeams = JSON.parse(mockLocalStorage['bb-score-teams']) as Team[];
    expect(savedTeams).toHaveLength(1);
    expect(savedTeams[0].name).toBe('Team B');
  });

  describe('team management', () => {
    let createdTeam: Team;

    beforeEach(async () => {
      createdTeam = {
        id: 'id',
        name: 'Team A',
        location: 'Loc1',
        players: [],
      };
      mockLocalStorage['bb-score-teams'] = JSON.stringify([createdTeam]);
    });

    it('should update an existing team and save to localStorage', async () => {
      const updatedTeam: Team = {
        ...createdTeam,
        name: 'Team A Updated',
        location: 'Loc2',
        players: [],
      };

      service.updateTeam(updatedTeam);

      const updatedTeams = await firstValueFrom(service.getTeams());
      const team = updatedTeams[0];
      expect(team.name).toBe('Team A Updated');
      expect(team.location).toBe('Loc2');

      // Verify localStorage was updated
      const savedTeams = JSON.parse(
        mockLocalStorage['bb-score-teams'],
      ) as Team[];
      expect(savedTeams[0].name).toBe('Team A Updated');
      expect(savedTeams[0].location).toBe('Loc2');
    });

    it('should delete a team and update localStorage', async () => {
      const teamId = createdTeam.id;
      service.deleteTeam(teamId);

      const remainingTeams = await firstValueFrom(service.getTeams());
      expect(remainingTeams).toHaveLength(0);

      // Verify localStorage was updated
      const savedTeams = JSON.parse(mockLocalStorage['bb-score-teams']);
      expect(savedTeams).toHaveLength(0);
    });

    it('should get a team by id', async () => {
      const retrievedTeam = await firstValueFrom(
        service.getTeam(createdTeam.id),
      );

      expect(retrievedTeam).toBeTruthy();
      expect(retrievedTeam).toEqual(createdTeam);
    });
  });

  it('should return null for non-existent team', async () => {
    const retrievedTeam = await firstValueFrom(service.getTeam('non-existent'));
    expect(retrievedTeam).toBeNull();
  });

  // Player management tests
  it('should add a player to a team', async () => {
    const team: Team = { id: '1', name: 'Team A', players: [] };
    mockLocalStorage['bb-score-teams'] = JSON.stringify([team]);

    // Add a player
    const player: Omit<Player, 'id'> = {
      name: 'John Doe',
      number: 23,
      league: ['League 1'],
    };
    service.addPlayer(team.id, player);

    // Verify player was added
    const updatedTeam = await firstValueFrom(service.getTeam('1'));
    expect(updatedTeam?.players).toHaveLength(1);
    expect(updatedTeam?.players[0].name).toBe('John Doe');
    expect(updatedTeam?.players[0].number).toBe(23);
    expect(updatedTeam?.players[0].league).toEqual(['League 1']);
  });

  describe('player management', () => {
    let teamId: string;
    let playerId: string;

    beforeEach(async () => {
      // Create a team and add a player
      const team: Team = {
        id: '1',
        name: 'Team A',
        players: [
          {
            id: 'p-1',
            league: [],
            number: 23,
            name: 'John Doe',
          },
        ],
      };
      mockLocalStorage['bb-score-teams'] = JSON.stringify([team]);
      teamId = team.id;
      playerId = team.players[0].id;
    });

    it('should update a player in a team', async () => {
      // Update the player
      const updatedPlayer: Player = {
        id: playerId,
        name: 'John Doe Jr.',
        number: 24,
        league: ['League 1'],
      };
      service.updatePlayer(teamId, updatedPlayer);

      // Verify player was updated
      const updatedTeam = await firstValueFrom(service.getTeam(teamId));
      expect(updatedTeam?.players).toHaveLength(1);
      expect(updatedTeam?.players[0].name).toBe('John Doe Jr.');
      expect(updatedTeam?.players[0].number).toBe(24);
      expect(updatedTeam?.players[0].league).toEqual(['League 1']);
    });

    it('should remove a player from a team', async () => {
      // Remove the player
      service.removePlayer(teamId, playerId);

      // Verify player was removed
      const updatedTeam = await firstValueFrom(service.getTeam(teamId));
      expect(updatedTeam?.players).toHaveLength(0);
    });
  });
});
