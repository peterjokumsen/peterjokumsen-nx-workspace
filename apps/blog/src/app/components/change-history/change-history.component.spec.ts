import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeHistoryComponent } from './change-history.component';
import { MarkdownAst } from '@peterjokumsen/ts-md-models';
import { MdRendererComponent } from '@peterjokumsen/md-renderer';
import { MockComponent } from 'ng-mocks';
import { PjArticleParser } from '@peterjokumsen/ng-services';
import { of } from 'rxjs';

describe('ChangeHistoryComponent', () => {
  let component: ChangeHistoryComponent;
  let fixture: ComponentFixture<ChangeHistoryComponent>;
  let parserSpy: jest.Mocked<PjArticleParser>;

  beforeEach(async () => {
    parserSpy = jest.mocked<Partial<PjArticleParser>>({
      fromSource: jest.fn(),
    }) as unknown as jest.Mocked<PjArticleParser>;
    parserSpy.fromSource.mockReturnValue(of<MarkdownAst>({ sections: [] }));

    await TestBed.configureTestingModule({
      imports: [ChangeHistoryComponent],
      providers: [
        // keep split
        { provide: PjArticleParser, useValue: parserSpy },
      ],
    })
      .overrideComponent(ChangeHistoryComponent, {
        remove: {
          imports: [MdRendererComponent],
        },
        add: {
          imports: [MockComponent(MdRendererComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ChangeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the parser to parse the article', () => {
    expect(parserSpy.fromSource).toHaveBeenCalledWith(expect.any(String));
  });
});
