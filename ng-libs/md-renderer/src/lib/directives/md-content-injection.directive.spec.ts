import {
  Component,
  ComponentRef,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MarkdownContent,
  MarkdownImage,
  MarkdownSection,
} from '@peterjokumsen/ts-md-models';

import { HasContent } from '../has-content';
import { MdComponentMapService } from '../services';
import { MdContentInjectionDirective } from './md-content-injection.directive';
import { MdWrapperComponent } from '../components';
import { MockComponent } from 'ng-mocks';
import { WithId } from '../models';

@Component({
  standalone: true,
  template: '',
})
class HasContentComponent implements HasContent {
  content: string | MarkdownContent | WithId<MarkdownContent> = '';
}

@Component({
  standalone: true,
  imports: [MdContentInjectionDirective, MdWrapperComponent],
  template:
    '<pj-mdr-md-wrapper [pjMdrMdContentInjection]="content"></pj-mdr-md-wrapper>',
})
class SectionHostComponent {
  @ViewChild(MdContentInjectionDirective, { static: true })
  directive!: MdContentInjectionDirective;

  content: WithId<MarkdownContent> = {
    content: [],
    id: '',
    title: '',
    type: 'section',
  };
}

describe('MdContentInjectionDirective', () => {
  let fixture: ComponentFixture<SectionHostComponent>;
  let component: SectionHostComponent;
  let directive: MdContentInjectionDirective;
  let mapSpy: Partial<jest.Mocked<MdComponentMapService>>;
  let createdComponentInstance: Partial<HasContent>;
  let viewContainerSpy: Partial<jest.Mocked<ViewContainerRef>>;

  beforeEach(async () => {
    mapSpy = {
      getComponent: jest
        .fn()
        .mockReturnValue(HasContentComponent)
        .mockName('ComponentMap.getComponent'),
    };
    createdComponentInstance = {};
    viewContainerSpy = {
      createComponent: jest
        .fn()
        .mockReturnValue({
          instance: createdComponentInstance,
        } as ComponentRef<HasContent>)
        .mockName('MdWrapper.container.createComponent'),
    };

    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: MdComponentMapService, useValue: mapSpy },
      ],
      imports: [SectionHostComponent],
    })
      .overrideComponent(SectionHostComponent, {
        remove: { imports: [MdWrapperComponent] },
        add: { imports: [MockComponent(MdWrapperComponent)] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SectionHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    directive = component.directive;
    directive.wrapper.container = viewContainerSpy as ViewContainerRef;
  });

  function setComponentContent(content: WithId<MarkdownContent>) {
    component.content = content;
    fixture.detectChanges();
  }

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('when content is section', () => {
    it('should create component for content and set content on created component', () => {
      setComponentContent({
        id: '',
        type: 'section',
        title: 'Section Title',
        content: [{ type: 'paragraph', content: 'Hello, world!' }],
      });

      expect(mapSpy.getComponent).toHaveBeenCalledWith('paragraph');
      expect(viewContainerSpy.createComponent).toHaveBeenCalledWith(
        HasContentComponent,
      );
      expect(createdComponentInstance.content).toEqual({
        type: 'paragraph',
        content: 'Hello, world!',
      });
    });
  });

  describe('when content is image', () => {
    it('should create an image component', () => {
      setComponentContent({
        id: '',
        type: 'image',
        alt: 'alt text',
        src: '/image.jpg',
      });
      expect(mapSpy.getComponent).toHaveBeenCalledWith('image');
      expect(viewContainerSpy.createComponent).toHaveBeenCalledWith(
        HasContentComponent,
      );
      expect(createdComponentInstance.content).toEqual(
        expect.objectContaining({
          type: 'image',
          alt: 'alt text',
          src: '/image.jpg',
        }),
      );
    });
  });

  describe('when content is link', () => {
    it('should create a link component', () => {
      setComponentContent({
        id: '',
        type: 'link',
        href: '/link',
        content: [{ type: 'text', content: 'Link' }],
      });
      expect(mapSpy.getComponent).toHaveBeenCalledWith('link');
      expect(viewContainerSpy.createComponent).toHaveBeenCalledWith(
        HasContentComponent,
      );
      expect(createdComponentInstance.content).toEqual(
        expect.objectContaining({
          type: 'link',
          href: '/link',
          content: [{ type: 'text', content: 'Link' }],
        }),
      );
    });
  });
});
