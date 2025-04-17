import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdRendererComponent } from '@peterjokumsen/md-renderer';
import { PjMarkdownClient } from '@peterjokumsen/ng-services';
import { MarkdownAst } from '@peterjokumsen/ts-md-models';
import { MockComponent } from 'ng-mocks';
import { Observable } from 'rxjs';
import { AboutMeComponent } from '../../pages/about-me';
import { DisplayMarkdownComponent } from './display-markdown.component';

describe('DisplayMarkdownComponent', () => {
  let component: DisplayMarkdownComponent;
  let fixture: ComponentFixture<DisplayMarkdownComponent>;
  let mdClient: Partial<jest.Mocked<PjMarkdownClient>>;

  beforeEach(async () => {
    mdClient = {
      readMarkdown: jest
        .fn()
        .mockName('readMarkdown')
        .mockReturnValue(new Observable<MarkdownAst>()),
    };
    await TestBed.configureTestingModule({
      providers: [
        // keep split
        { provide: PjMarkdownClient, useValue: mdClient },
      ],
      imports: [AboutMeComponent],
    })
      .overrideComponent(AboutMeComponent, {
        set: {
          imports: [MockComponent(MdRendererComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DisplayMarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when filePath is set', () => {
    it('should read markdown', () => {
      component.filePath = 'assets/docs/about-me.md';
      expect(mdClient.readMarkdown).toHaveBeenCalledWith(
        'assets/docs/about-me.md',
      );
    });
  });

  describe.each(['', undefined])('when filePath is "%s"', (path) => {
    it('should not read markdown', () => {
      component.filePath = path as string;
      expect(mdClient.readMarkdown).not.toHaveBeenCalled();
    });
  });
});
