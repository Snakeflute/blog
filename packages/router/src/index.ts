// context collection processing
import * as _ from 'lodash';
import { ArticleContext } from '@blog/common/interfaces/articles/article-context';
import { Meta, MetaName, MetaValue, RouteMeta, RoutePathPrefix } from '@blog/common/interfaces/routes';
import { Layout } from '@blog/common/interfaces/routes/layout';
import { buildFullURL, buildURLPath } from '@blog/common/utils/path.util';
import { format } from 'date-fns';
import { buildTitle } from './title.util';
import {
  createTagDetailMetas,
  createTagDetailRouteItem,
  createTagsOverviewMetas,
  createTagsOverviewRouteItem
} from './tag.route.util';
import {
  createCategoriesOverviewMetas,
  createCategoriesOverviewRouteItem,
  createCategoryDetailMetas,
  createCategoryDetailRouteItem
} from './category.route.util';
import { createPostDetailMetas, createPostsOverviewMetas, createPostsOverviewRouteItem } from './post.route.util';
import {
  createBreadcrumbList,
  createCategoriesOverviewBreadcrumbItem,
  createCategoryDetailBreadcrumbItem,
  createHomeBreadcrumbItem,
  createPageDetailBreadcrumbItem,
  createPostDetailBreadcrumbItem,
  createPostsOverviewBreadcrumbItem,
  createTagDetailBreadcrumbItem,
  createTagsOverviewBreadcrumbItem
} from './breadcrumb.util';
import { createHomeMetas } from './home.route.util';
import { loadConfig } from '@blog/config';

export * from './home.route.util';
export * from './tag.route.util';
export * from './category.route.util';
export * from './post.route.util';
export * from './sitemap.util';

export interface RoutesOptions {
  baseUrl: string;
  baseTitle: string;
  titleSeparator: string;
}

export const createCommonMetas = (options: Partial<RoutesOptions>): Meta[] => [
  {
    name: MetaName.OPEN_GRAPH_SITE_NAME,
    content: options.baseTitle
  },
  {
    name: MetaName.OPEN_GRAPH_TYPE,
    content: MetaValue.WEBSITE
  }
];

export const createGoogleAnalyticsMeta = (): Meta[] => {
  const config = loadConfig();
  return config.site.googleAnalytics
    ? [
        {
          name: MetaName.GOOGLE_SITE_VERIFICATION,
          content: config.site.googleAnalytics.verification
        },
        {
          id: MetaName.GOOGLE_SITE_TRACKING,
          name: MetaName.GOOGLE_SITE_TRACKING,
          content: config.site.googleAnalytics.tracking
        }
      ]
    : [];
};

export const createTagsOverviewRouteMeta = (
  contexts: ArticleContext[],
  options?: Partial<RoutesOptions>
): RouteMeta => {
  const tagsOverviewRouteItem = createTagsOverviewRouteItem();
  const path = buildURLPath(RoutePathPrefix.TAGS);
  const title = buildTitle(tagsOverviewRouteItem.label, options.baseTitle, options.titleSeparator);
  const url = buildFullURL(options.baseUrl, path);

  return {
    key: path,
    url: url,
    path: path,
    title: title,
    breadcrumbs: createBreadcrumbList([
      createHomeBreadcrumbItem(options.baseUrl, options.baseTitle, RoutePathPrefix.HOME),
      createTagsOverviewBreadcrumbItem(options.baseUrl, tagsOverviewRouteItem.label, path)
    ]),
    type: Layout.TABLE,
    metas: _.concat(createGoogleAnalyticsMeta(), createTagsOverviewMetas(), createCommonMetas(options)),
    data: undefined
  };
};
export const createCategoriesOverviewRouteMeta = (
  contexts: ArticleContext[],
  options?: Partial<RoutesOptions>
): RouteMeta => {
  const categoriesOverviewRouteItem = createCategoriesOverviewRouteItem();
  const path = buildURLPath(RoutePathPrefix.CATEGORIES);
  const title = buildTitle(categoriesOverviewRouteItem.label, options.baseTitle, options.titleSeparator);
  const url = buildFullURL(options.baseUrl, path);

  return {
    key: path,
    url: url,
    path: path,
    title: title,
    breadcrumbs: createBreadcrumbList([
      createHomeBreadcrumbItem(options.baseUrl, options.baseTitle, RoutePathPrefix.HOME),
      createCategoriesOverviewBreadcrumbItem(options.baseUrl, categoriesOverviewRouteItem.label, path)
    ]),
    type: Layout.TABLE,
    metas: _.concat(createGoogleAnalyticsMeta(), createCategoriesOverviewMetas(), createCommonMetas(options)),
    data: undefined
  };
};
export const createPostsOverviewRouteMeta = (
  contexts: ArticleContext[],
  options?: Partial<RoutesOptions>
): RouteMeta => {
  const postsOverviewRouteItem = createPostsOverviewRouteItem();
  const path = buildURLPath(RoutePathPrefix.POSTS);
  const title = buildTitle(postsOverviewRouteItem.label, options.baseTitle, options.titleSeparator);
  const url = buildFullURL(options.baseUrl, path);

  return {
    key: path,
    url: url,
    path: path,
    title: title,
    breadcrumbs: createBreadcrumbList([
      createHomeBreadcrumbItem(options.baseUrl, options.baseTitle, RoutePathPrefix.HOME),
      createPostsOverviewBreadcrumbItem(options.baseUrl, postsOverviewRouteItem.label, path)
    ]),
    type: Layout.LIST,
    metas: _.concat(createGoogleAnalyticsMeta(), createPostsOverviewMetas(), createCommonMetas(options)),
    data: undefined
  };
};

export const createHomeRouteMeta = (options?: Partial<RoutesOptions>): RouteMeta => {
  const path = buildURLPath();
  const title = options.baseTitle;
  const url = buildFullURL(options.baseUrl, path);

  return {
    key: path,
    url: url,
    path: path,
    title: title,
    breadcrumbs: createBreadcrumbList([
      createHomeBreadcrumbItem(options.baseUrl, options.baseTitle, RoutePathPrefix.HOME)
    ]),
    type: Layout.LIST,
    metas: _.concat(createGoogleAnalyticsMeta(), createHomeMetas(), createCommonMetas(options)),
    data: undefined
  };
};

// single item
export const createTagDetailRouteMeta = (
  rawTag: string,
  contexts: ArticleContext[],
  options?: Partial<RoutesOptions>
): RouteMeta => {
  const tagsOverviewRouteItem = createTagsOverviewRouteItem();
  const tagsOverviewRouteMeta = createTagsOverviewRouteMeta(contexts, options);

  const tagInfo = createTagDetailRouteItem(rawTag);
  const path = buildURLPath(RoutePathPrefix.TAGS, tagInfo.id);
  const title = buildTitle(tagInfo.label, options.baseTitle, options.titleSeparator);
  const url = buildFullURL(options.baseUrl, path);

  return {
    key: rawTag,
    url: url,
    path: path,
    title: title,
    breadcrumbs: createBreadcrumbList([
      createHomeBreadcrumbItem(options.baseUrl, options.baseTitle, RoutePathPrefix.HOME),
      createTagsOverviewBreadcrumbItem(options.baseUrl, tagsOverviewRouteItem.label, tagsOverviewRouteMeta.path),
      createTagDetailBreadcrumbItem(options.baseUrl, rawTag, path)
    ]),
    metas: _.concat(createGoogleAnalyticsMeta(), createCommonMetas(options), createTagDetailMetas(rawTag)),
    type: Layout.LIST,
    data: undefined
  };
};

export const createCategoryDetailRouteMeta = (
  rawCategory: string,
  contexts: ArticleContext[],
  options?: Partial<RoutesOptions>
): RouteMeta => {
  const categoriesOverviewRouteItem = createCategoriesOverviewRouteItem();
  const categoriesOverviewRouteMeta = createCategoriesOverviewRouteMeta(contexts, options);

  const categoryInfo = createCategoryDetailRouteItem(rawCategory);
  const path = buildURLPath(RoutePathPrefix.CATEGORIES, categoryInfo.id);
  const title = buildTitle(categoryInfo.label, options.baseTitle, options.titleSeparator);
  const url = buildFullURL(options.baseUrl, path);

  return {
    key: rawCategory,
    url: url,
    path: path,
    title: title,
    breadcrumbs: createBreadcrumbList([
      createHomeBreadcrumbItem(options.baseUrl, options.baseTitle, RoutePathPrefix.HOME),
      createCategoriesOverviewBreadcrumbItem(
        options.baseUrl,
        categoriesOverviewRouteItem.label,
        categoriesOverviewRouteMeta.path
      ),
      createCategoryDetailBreadcrumbItem(options.baseUrl, rawCategory, path)
    ]),
    type: Layout.LIST,
    metas: _.concat(createGoogleAnalyticsMeta(), createCommonMetas(options), createCategoryDetailMetas(rawCategory)),
    data: undefined
  };
};

export const createPostDetailRouteMeta = (
  article: ArticleContext,
  contexts: ArticleContext[],
  options?: Partial<RoutesOptions>
): RouteMeta => {
  const postsOverviewRouteItem = createPostsOverviewRouteItem();
  const postsOverviewRouteMeta = createPostsOverviewRouteMeta(contexts, options);
  const created = new Date(article.created);

  const year = format(created, 'yyyy');
  const month = format(created, 'MM');
  const date = format(created, 'dd');
  const id = article.id;

  const path = buildURLPath(RoutePathPrefix.POSTS, year, month, date, id);
  const title = buildTitle(article.title, options.baseTitle, options.titleSeparator);
  const url = buildFullURL(options.baseUrl, path);

  return {
    key: article.id,
    url: url,
    path: path,
    title: title,
    breadcrumbs: createBreadcrumbList([
      createHomeBreadcrumbItem(options.baseUrl, options.baseTitle, RoutePathPrefix.HOME),
      createPostsOverviewBreadcrumbItem(options.baseUrl, postsOverviewRouteItem.label, postsOverviewRouteMeta.path),
      createPostDetailBreadcrumbItem(options.baseUrl, article.title, path)
    ]),
    type: Layout.DETAIL,
    metas: _.concat(createGoogleAnalyticsMeta(), createCommonMetas(options), createPostDetailMetas(article)),
    data: undefined
  };
};

export const createPagesDetailRouteMeta = (article: ArticleContext, options?: Partial<RoutesOptions>): RouteMeta => {
  const path = buildURLPath(RoutePathPrefix.PAGES, article.id);
  const title = buildTitle(article.title, options.baseTitle, options.titleSeparator);
  const url = buildFullURL(options.baseUrl, path);

  return {
    key: article.id,
    path: path,
    title: title,
    url: url,
    breadcrumbs: createBreadcrumbList([
      createHomeBreadcrumbItem(options.baseUrl, options.baseTitle, RoutePathPrefix.HOME),
      createPageDetailBreadcrumbItem(options.baseUrl, article.title, path)
    ]),
    metas: _.concat(createGoogleAnalyticsMeta(), createCommonMetas(options), createPostDetailMetas(article)),
    type: Layout.DETAIL,
    data: undefined
  };
};
