/**
 * API 接口类型定义模块
 *
 * 提供所有后端接口的类型定义
 *
 * ## 主要功能
 *
 * - 通用类型（分页参数、响应结构等）
 * - 认证类型（登录、用户信息等）
 * - 系统管理类型（用户、角色等）
 * - 全局命名空间声明
 *
 * ## 使用场景
 *
 * - API 请求参数类型约束
 * - API 响应数据类型定义
 * - 接口文档类型同步
 *
 * ## 注意事项
 *
 * - 在 .vue 文件使用需要在 eslint.config.mjs 中配置 globals: { Api: 'readonly' }
 * - 使用全局命名空间，无需导入即可使用
 *
 * ## 使用方式
 *
 * ```typescript
 * const params: Api.Auth.LoginParams = { username: 'admin', password: '123456' }
 * const response: Api.Auth.UserInfo = await fetchUserInfo()
 * ```
 *
 * @module types/api/api
 * @author Art Design Pro Team
 */

declare namespace Api {
    /** 通用类型 */
    namespace Common {
        /** 分页参数 */
        interface PaginationParams {
            /** 当前页码 */
            page: number
            /** 每页条数 */
            size: number
            /** 总条数 */
            total: number
        }

        /** 通用搜索参数 */
        type CommonSearchParams = Pick<PaginationParams, 'page' | 'size'>

        /** 分页响应基础结构 */
        interface PaginatedResponse<T = any> {
            list: T[]
            page: number
            size: number
            total: number
        }

        /** 启用状态 */
        type EnableStatus = '1' | '2'
    }

    /** 认证类型 */
    namespace Auth {
        /** 登录参数 */
        interface LoginParams {
            username: string
            password: string
        }

        /** 注册参数 */
        interface RegisterParams {
            username: string
            password: string
            email?: string
            mobile?: string
        }

        /** 登录响应 */
        interface LoginResponse {
            accessToken: string
            refreshToken: string
        }

        /** 用户信息 */
        interface UserInfo {
            buttons: string[]
            roles: string[]
            userId: number
            username: string
            email: string
            avatar?: string
            nickname?: string
            mobile?: string
            gender?: number
            realName?: string
            address?: string
            bio?: string
        }

        /** 更新用户信息参数 */
        interface UpdateUserInfoParams {
            nickname?: string
            email?: string
            mobile?: string
            gender?: number
            realName?: string
            address?: string
            bio?: string
        }

        /** 修改密码参数 */
        interface ChangePasswordParams {
            oldPassword: string
            newPassword: string
            confirmPassword: string
        }
    }

    /** 系统管理类型 */
    namespace SystemManage {
        /** 用户列表 */
        type UserList = Api.Common.PaginatedResponse<UserListItem>

        /** 用户列表项 */
        interface UserListItem {
            /** 主键ID */
            id: number
            /** 用户名 */
            username: string
            /** 统一ID */
            unionId: string
            /** 手机号 */
            mobile: string
            /** 邮箱 */
            email: string
            /** 昵称 */
            nickname: string
            /** 头像 */
            avatar: string
            /** 性别 (0:未知, 1:男, 2:女) */
            gender: number
            /** 生日 */
            birthday: string
            /** 身高(cm) */
            height: number
            /** 状态 (0:禁用, 1:启用) */
            // TODO:修改类型
            status: string
            /** 手机号已验证 */
            mobileVerified: boolean
            /** 邮箱已验证 */
            emailVerified: boolean
            /** 最后登录时间 */
            lastLoginAt?: string
            /** 用户角色列表 */
            userRoles?: string[]
            /** 创建时间 */
            createdAt: string
            /** 更新时间 */
            updatedAt: string
            /** 删除时间 */
            deletedAt?: string
        }

        /** 用户搜索参数 */
        type UserSearchParams = Partial<
            Pick<UserListItem, 'id' | 'username' | 'gender' | 'mobile' | 'email' | 'status'> &
                Api.Common.CommonSearchParams
        >

        type UserCreateBody = Pick<UserListItem, 'username' | 'mobile' | 'gender'>

        type UserUpdateBody = Pick<UserListItem, 'id'> & UserCreateBody

        /** 角色列表 */
        type RoleList = Api.Common.PaginatedResponse<RoleListItem>

        /** 角色列表项 */
        interface RoleListItem {
            id: number
            name: string
            description: string
            memberCount?: number
            defaultFlag?: boolean
            updateFlag?: boolean
            roleMenus?: RoleMenu[]
            /** 创建时间 */
            createdAt?: string
            /** 更新时间 */
            updatedAt?: string
            /** 删除时间 */
            deletedAt?: string
        }

        interface RoleMenu {
            menuId: number
            actionId: number
        }

        /** 角色搜索参数 */
        type RoleSearchParams = Partial<
            Pick<RoleListItem, 'id' | 'name' | 'description'> & Api.Common.CommonSearchParams
        >

        type RoleCreateBody = Pick<RoleListItem, 'name' | 'description'>

        type RoleUpdateBody = Pick<RoleListItem, 'id'> & RoleCreateBody

        type RolePermissionUpdateBody = Pick<RoleListItem, 'id'> & {
            roleMenus: RoleMenu[]
        }

        /** 菜单创建参数 */
        interface MenuCreateBody {
            /** 父级菜单ID，父级菜单填0 */
            parentId: number
            /** 路由地址 */
            path: string
            /** 组件名（权限标识） */
            name: string
            /** 菜单名称 */
            title: string
            /** 组件路径 */
            component?: string
            /** 图标 */
            icon?: string
            /** 外部链接 */
            link?: string
            /** 是否显示文本徽章 */
            showBadge?: boolean
            /** 文本徽章 */
            showTextBadge?: string
            /** 激活路径 */
            activePath?: string
            /** 隐藏菜单 */
            isHide?: boolean
            /** 是否在标签页中隐藏 */
            isHideTab?: boolean
            /** 是否为iframe */
            isIframe?: boolean
            /** 是否缓存 */
            keepAlive?: boolean
            /** 是否固定标签页 */
            fixedTab?: boolean
            /** 菜单排序 */
            order?: number
        }

        /** 菜单更新参数 */
        interface MenuUpdateBody extends MenuCreateBody {
            /** 菜单ID */
            id: number
        }

        /** 菜单权限按钮创建参数 */
        interface MenuActionCreateBody {
            /** 菜单ID */
            menuId: number
            /** 权限名称 */
            title: string
            /** 权限标识 */
            authMark: string
            /** 资源标识列表 */
            permissionCodes: string[]
        }

        /** 菜单权限按钮更新参数 */
        interface MenuActionUpdateBody extends MenuActionCreateBody {
            /** 动作ID */
            id: number
        }
    }
}
