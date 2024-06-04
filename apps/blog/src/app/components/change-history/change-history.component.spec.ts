import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { PjArticle, PjArticleParser } from '@peterjokumsen/ng-services';

import { ArticleComponent } from '@peterjokumsen/ui-elements';
import { ChangeHistoryComponent } from './change-history.component';
import { JsonPipe } from '@angular/common';
import { of } from 'rxjs';

describe('ChangeHistoryComponent', () => {
  let component: ChangeHistoryComponent;
  let fixture: ComponentFixture<ChangeHistoryComponent>;
  let parserSpy: jest.Mocked<PjArticleParser>;

  beforeEach(async () => {
    parserSpy = jest.mocked<Partial<PjArticleParser>>({
      fromSource: jest.fn(),
    }) as unknown as jest.Mocked<PjArticleParser>;
    parserSpy.fromSource.mockReturnValue(
      of<PjArticle>({ sections: [{ title: 'test', content: 'testing' }] }),
    );

    await TestBed.configureTestingModule({
      imports: [ChangeHistoryComponent],
      providers: [
        // keep split
        { provide: PjArticleParser, useValue: parserSpy },
      ],
    })
      .overrideComponent(ChangeHistoryComponent, {
        set: {
          imports: [
            MockComponent(ArticleComponent),
            MockComponent(MatCard),
            MockComponent(MatCardHeader),
            MockDirective(MatCardContent),
            MockPipe(JsonPipe),
          ],
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
    expect(component.article()).toEqual({
      sections: [{ title: 'test', content: 'testing' }],
    });
  });
});
