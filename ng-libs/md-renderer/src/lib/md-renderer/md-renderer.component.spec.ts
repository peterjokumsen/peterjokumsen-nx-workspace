import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { MdRendererComponent } from './md-renderer.component';
import { MockComponent } from 'ng-mocks';
import { TableOfContentsComponent } from '../toc/table-of-contents.component';

describe('MdRendererComponent', () => {
  let component: MdRendererComponent;
  let fixture: ComponentFixture<MdRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MdRendererComponent],
    })
      .overrideComponent(MdRendererComponent, {
        set: {
          imports: [MockComponent(TableOfContentsComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MdRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
