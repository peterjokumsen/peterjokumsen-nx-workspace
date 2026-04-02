import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PjMarkdownClient, SeoService } from '@peterjokumsen/ng-services';
import { MarkdownAst } from '@peterjokumsen/ts-md-models';
import { PageIntroductionComponent } from '@peterjokumsen/ui-elements';
import { MockComponent } from 'ng-mocks';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { DisplayMarkdownComponent } from '../../components';
import { MarkdownEntryComponent } from './markdown-entry.component';

describe('MarkdownEntryComponent', () => {
  let component: MarkdownEntryComponent;
  let fixture: ComponentFixture<MarkdownEntryComponent>;
  let mockRoute: any;
  let mockRouter: any;
  let mockMdClient: any;
  let mockSeoService: any;
  let subject: BehaviorSubject<Params>;

  beforeEach(async () => {
    subject = new BehaviorSubject<Params>({ articlePath: 'test' });
    mockRoute = {
      snapshot: {
        url: [{ path: 'test' }],
      },
      params: subject.asObservable(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    mockMdClient = {
      resolveMarkdown: jest.fn().mockReturnValue(
        of({
          ast: { title: 'Test', description: 'Desc' } as MarkdownAst,
          resolvedPath: 'assets/docs/test.md',
        }),
      ),
    };
    mockSeoService = {
      updateFromMarkdown: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MarkdownEntryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: PjMarkdownClient, useValue: mockMdClient },
        { provide: SeoService, useValue: mockSeoService },
      ],
    })
      .overrideComponent(MarkdownEntryComponent, {
        set: {
          imports: [
            MockComponent(PageIntroductionComponent),
            MockComponent(DisplayMarkdownComponent),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MarkdownEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve markdown on init', () => {
    expect(mockMdClient.resolveMarkdown).toHaveBeenCalledWith('test');
    expect(component.workingPath()).toBe('assets/docs/test.md');
  });

  it('should navigate to 404 if resolution fails', () => {
    mockMdClient.resolveMarkdown.mockReturnValue(
      throwError(() => new Error('404')),
    );
    subject.next({ articlePath: 'fail' });
    fixture.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/404'], {
      skipLocationChange: true,
    });
  });

  it('should update metadata and SEO when metadata is loaded', () => {
    const mockAst = { title: 'New' } as MarkdownAst;
    component.onMetadataLoaded(mockAst);
    expect(component.metadata()).toEqual(mockAst);
    expect(mockSeoService.updateFromMarkdown).toHaveBeenCalledWith(mockAst);
  });
});
