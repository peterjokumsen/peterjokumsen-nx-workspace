import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutMeComponent } from './about-me.component';
import { MarkdownAst } from '@peterjokumsen/ts-md-models';
import { MdRendererComponent } from '@peterjokumsen/md-renderer';
import { MockComponent } from 'ng-mocks';
import { Observable } from 'rxjs';
import { PjMarkdownClient } from '@peterjokumsen/ng-services';

describe('AboutMeComponent', () => {
  let component: AboutMeComponent;
  let fixture: ComponentFixture<AboutMeComponent>;
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

    fixture = TestBed.createComponent(AboutMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read markdown', () => {
    expect(mdClient.readMarkdown).toHaveBeenCalledWith('assets/docs/about-me.md');
  });
});
