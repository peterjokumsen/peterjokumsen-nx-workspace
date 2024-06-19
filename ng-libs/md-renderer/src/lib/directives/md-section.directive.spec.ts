import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownContent, MarkdownSection } from '@peterjokumsen/ts-md-models';

import { HasContent } from '../has-content';
import { MdComponentMapService } from '../services';
import { MdSectionDirective } from './md-section.directive';
import { MdWrapperComponent } from '../components';
import { WithId } from '../models';

@Component({
  standalone: true,
  template: '',
})
class SubSectionComponent implements HasContent {
  content: string | MarkdownContent | WithId<MarkdownContent> = '';
}

@Component({
  standalone: true,
  imports: [MdSectionDirective, MdWrapperComponent],
  template:
    '<pj-mdr-md-wrapper [pjMdrMdSection]="section"></pj-mdr-md-wrapper>',
})
class SectionHostComponent {
  @ViewChild(MdSectionDirective, { static: true })
  directive!: MdSectionDirective;

  section: WithId<MarkdownSection> = {
    content: [],
    id: '',
    title: '',
    type: 'section',
  };
}

describe('MdSectionDirective', () => {
  let fixture: ComponentFixture<SectionHostComponent>;
  let component: SectionHostComponent;
  let directive: MdSectionDirective;
  let mapSpy: Partial<jest.Mocked<MdComponentMapService>>;

  beforeEach(async () => {
    mapSpy = {
      getComponent: jest.fn().mockName('ComponentMap.getComponent'),
    };

    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: MdComponentMapService, useValue: mapSpy },
      ],
      imports: [SectionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    directive = component.directive;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('when section has content', () => {
    beforeEach(() => {
      mapSpy.getComponent?.mockReturnValue(SubSectionComponent);
      component.section = {
        ...component.section,
        content: [
          { type: 'paragraph', content: 'Hello, world!' },
          { type: 'list', content: ['Goodbye, world!'] },
        ],
      };
      fixture.detectChanges();
    });

    it('should create components for each content', () => {
      expect(mapSpy.getComponent).toHaveBeenCalledWith('paragraph');
      expect(mapSpy.getComponent).toHaveBeenCalledWith('list');
    });
  });
});
