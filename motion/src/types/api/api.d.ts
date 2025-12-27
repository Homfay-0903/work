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

        /** 上传文件参数 */
        interface UploadFileParams {
            /** 文件数据 */
            file: File
            /** 上传进度回调函数 */
            onUploadProgress?: (progressEvent: any) => void
        }

        /** 上传文件响应 */
        interface UploadFileResponse {
            /** 文件名称 */
            filename: string
            /** 文件路径 */
            path: string
            /** 文件URL */
            url: string
        }

        /** 上传文件到S3响应 */
        interface UploadFileToS3Response {
            /** 访问密钥 */
            accessKey: string
            /** 密钥 */
            secretKey: string
            /** 会话令牌 */
            sessionToken: string
            /** 文件URL */
            url: string
        }
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
            id: number
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
            id: number
            username?: string
            mobile?: string
            gender?: number
            nickname?: string
            email?: string
            userRoles?: Array<{
                userId: number
                roleId: number
            }>
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

    namespace Tag {
        /** 标签列表 */
        type TagList = Api.Common.PaginatedResponse<TagListItem>

        /** 标签列表项 */
        interface TagListItem {
            /** 主键ID */
            id: number
            /** 标签名称 */
            name: string
            /** 创建时间 */
            createdAt?: string
            /** 更新时间 */
            updatedAt?: string
            /** 删除时间 */
            deletedAt?: string
        }

        interface TagSearchParams extends Api.Common.CommonSearchParams {
            /** 标签名称 */
            name?: string
        }
    }

    /** 动作管理类型 */
    namespace Action {
        /** 动作列表 */
        type ActionList = Api.Common.PaginatedResponse<ActionListItem>

        /** 动作列表项 */
        interface ActionListItem {
            /** 主键ID */
            id: number
            /** 动作名称 */
            name: string
            /** 动作封面 */
            picture?: string
            /** 动作视频 */
            video?: string
            /** 器械名称 */
            equipment?: string
            /** 器械ID列表 */
            instrumentIds?: number[]
            /** 器械列表 */
            instruments?: InstrumentListItem[]
            /** 教练列表 */
            coach?: CoachListItem
            /** 教练ID */
            coachId: number
            /** 肌群ID列表 */
            muscleLegionIds?: number[]
            /** 肌肉ID列表 */
            musclIds?: number[]
            /** 标签ID列表 */
            tagIds?: number[]
            /** 标签列表 */
            tags?: tagItem[]
            /** 相关动作ID */
            relatedActionId: number
            /** 动作类型 */
            type: number
            /** 适用场景 */
            scene: number
            /** 动作介绍 */
            introduction: string
            /** 备注 */
            remark: string
            /** 难度 */
            difficulty: number
            /** 属性 */
            attribute: number
            /** 卡路里 */
            calories: number
            /** 状态 */
            status?: number
            /** 创建时间 */
            createdAt?: string
            /** 更新时间 */
            updatedAt?: string
            /** 删除时间 */
            deletedAt?: string
            /** 适用型号 */
            model?: string

            /** 训练部位 */
            part?: string
            /** 语言 */
            langName?: string
            /** 语言编码 */
            langCode?: string
            /** AI支持 */
            aiSupport?: boolean
            /** 操作人 */
            operator?: string
            /** 是否有子动作 */
            hasChildren?: boolean
            /** 子动作列表 */
            children?: ActionListItem[]
        }

        interface tagItem {
            id: number
            name: string
        }

        interface CoachListItem {
            id: number
            name: string
        }

        interface InstrumentListItem {
            id: number
            name: string
        }

        /** 动作搜索参数 */
        interface ActionSearchParams extends Api.Common.CommonSearchParams {
            /** 动作ID列表 */
            ids?: number[]
            /** 适用场景 (1:力量训练, 2:普拉提, 3:有氧减脂, 4:拉伸康复) */
            scene?: number
            /** 动作难度 (1:初级, 2:中级, 3:高级) */
            difficulty?: number
            /** 器械ID列表 */
            instrumentIds?: number[]
            /** 锻炼部位ID列表 (肌肉区域) */
            muscleRegionIds?: number[]
            /** 锻炼肌肉ID列表 */
            muscleIds?: number[]
            /** 标签ID列表 */
            tagIds?: number[]
            /** 动作类型 (1:视频动作, 2:非视频动作, 3:片头, 4:片尾) */
            type?: number
            /** 上下架状态 (1:上架中, 2:已下架, 3:草稿) */
            status?: number
            /** 教练ID */
            coachId?: number
            /** 名称关键字 (模糊搜索) */
            name?: string
            /** 语言编码 */
            langCode?: string
            /** 多语言启用状态 (0:禁用, 1:启用) */
            langStatus?: number
            /** 翻译状态 (0:未翻译, 1:翻译中, 2:已翻译) */
            translateStatus?: number
            /** 适用型号 */
            model?: string
        }

        /** 动作创建参数 */
        interface ActionCreateBody {
            /** 动作名称 */
            name: string
            /** 动作封面 */
            picture?: string
            /** 动作视频 */
            video?: string
            /** 器械ID列表 */
            instrumentIds?: number[]
            /** 教练ID */
            coachId: number
            /** 肌群ID列表 */
            muscleLegionIds?: number[]
            /** 肌肉ID列表 */
            musclIds?: number[]
            /** 标签ID列表 */
            tagIds?: number[]
            /** 相关动作ID */
            relatedActionId: number
            /** 动作类型 */
            type: number
            /** 适用场景 */
            scene: number
            /** 动作介绍 */
            introduction: string
            /** 其他 */
            other?: string
            /** 备注 */
            remark: string
            /** 难度 */
            difficulty: number
            /** 属性 */
            attribute: number
            /** 卡路里 */
            calories: number
        }

        /** 上下架状态更新 (1:上架中, 2:已下架, 3:草稿) */
        interface ActionStatus {
            id: number
            status: number
        }

        /** 动作更新参数 */
        interface ActionUpdateBody extends Partial<ActionCreateBody> {
            /** 动作ID */
            id: number
        }
    }

    namespace Coach {
        /** 教练列表 */
        type CoachList = Api.Common.PaginatedResponse<CoachListItem>

        /** 教练列表项 */
        interface CoachListItem {
            /** 主键ID */
            id: number
            /** 教练头像 */
            avatar?: string
            /** 教练姓名 */
            name: string
            /** 教练手机号 */
            phone: string
            /** 教练邮箱 */
            email: string
            /** 教练介绍 */
            introduction?: string
            /** 语言 */
            language?: string
            /** 教练状态 (1:正常, 2:禁用) */
            status: number
            /** 操作人 */
            operator?: string
            /** 是否有子数据（翻译后的子数据） */
            hasChildren?: boolean
            /** 子数据列表（翻译后的子数据） */
            children?: CoachListItem[]
            /** 创建时间 */
            createdAt?: string
            /** 更新时间 */
            updatedAt?: string
            /** 删除时间 */
            deletedAt?: string
        }

        interface CoachSearchParams extends Api.Common.CommonSearchParams {
            /** 教练ID列表 */
            ids?: number
            /** 教练姓名 */
            name?: string
            /** 教练状态 */
            status?: number
            /** 教练邮箱 */
            translateStatus?: number
        }

        /** 教练创建参数 */
        type CoachCreateBody = Omit<CoachListItem, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>

        /** 教练更新参数 */
        type CoachUpdateBody = Pick<CoachListItem, 'id'> & Partial<CoachCreateBody>
    }

    /** 器械管理类型 */
    namespace Equipment {
        /** 器械列表 */
        type EquipmentList = Api.Common.PaginatedResponse<EquipmentListItem>

        /** 器械列表项 */
        interface EquipmentListItem {
            /** 主键ID */
            id: number
            /** 器械图标 */
            icon?: string
            /** 器械名称 */
            name: string
            /** 语言 */
            language?: string
            /** 器械状态 (1:启用, 2:禁用) */
            status: number
            /** 操作人 */
            operator?: string
            /** 排序 */
            sort?: number
            /** 是否有子数据（翻译后的子数据） */
            hasChildren?: boolean
            /** 子数据列表（翻译后的子数据） */
            children?: EquipmentListItem[]
            /** 创建时间 */
            createdAt?: string
            /** 更新时间 */
            updatedAt?: string
            /** 删除时间 */
            deletedAt?: string
        }

        /** 器械搜索参数 */
        interface EquipmentSearchParams extends Api.Common.CommonSearchParams {
            /** 主键ID */
            id?: number
            /** 器械名称 */
            name?: string
            /** 器械状态 */
            status?: number
            /** 翻译状态 */
            translateStatus?: number
        }

        /** 器械创建参数 */
        type EquipmentCreateBody = Omit<
            EquipmentListItem,
            'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'hasChildren' | 'children'
        >

        /** 器械更新参数 */
        type EquipmentUpdateBody = Pick<EquipmentListItem, 'id'> & Partial<EquipmentCreateBody>
    }

    namespace Ai {
        /** 动作列表项 */
        interface AiListItem {
            /** 主键ID */
            id: number
            /** 动作名称 */
            name: string
            /** 动作介绍 */
            introduction?: string
            /**版本号 */
            version: string
        }

        /** 动作搜索参数 */
        type AiSearchParams = Partial<Pick<AiListItem, 'name' | 'id'> & Api.Common.CommonSearchParams>
        /** 动作创建参数 */
        type AiCreateBody = Omit<AiListItem, 'id' | 'introduction' | 'version'>

        /** 动作更新参数 */
        type AiUpdateBody = Pick<AiListItem, 'id'> & Partial<AiCreateBody>
    }

    namespace Character {
        /** 角色列表 */
        type CharacterList = Api.Common.PaginatedResponse<CharacterListItem>

        /** 角色列表项 */
        interface CharacterListItem {
            /** 主键ID */
            id: number
            /** 角色名称 */
            name: string
            /** 角色描述 */
            description?: string
            /** 创建人 */
            creator: string
            /** 角色状态 (1:启用, 2:禁用) */
            status: number
            /** 操作人 */
            operator?: string
            /** 创建时间 */
            createdAt?: string
            /** 更新时间 */
            updatedAt?: string
            /** 删除时间 */
            deletedAt?: string
        }

        /** 角色搜索参数 */
        type CharacterSearchParams = Partial<Pick<CharacterListItem, 'name'> & Api.Common.CommonSearchParams>

        /** 角色创建参数 */
        type CharacterCreateBody = Omit<CharacterListItem, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>

        /** 角色更新参数 */
        type CharacterUpdateBody = Pick<CharacterListItem, 'id'> & Partial<CharacterCreateBody>
    }

    namespace Account {
        /** 账号列表 */
        type AccountList = Api.Common.PaginatedResponse<AccountListItem>

        /** 账号列表项 */
        interface AccountListItem {
            /** 主键ID */
            id: number
            /** 账号名称 */
            name: string
            /** 角色 */
            character: string
            /** 账号状态 (1:启用, 2:禁用) */
            status: number
            /**最近登录时间 */
            lastLoginAt?: string
        }

        /** 账号搜索参数 */
        type AccountSearchParams = Partial<Pick<AccountListItem, 'name'> & Api.Common.CommonSearchParams>

        /** 账号创建参数 */
        type AccountCreateBody = Omit<AccountListItem, 'id' | 'lastLoginAt'>

        /** 账号更新参数 */
        type AccountUpdateBody = Pick<AccountListItem, 'id'> & Partial<AccountCreateBody>
    }

    namespace Opration {
        /** 操作日志列表 */
        type OprationList = Api.Common.PaginatedResponse<OprationListItem>

        /** 操作日志列表项 */
        interface OprationListItem {
            /** 主键ID */
            id: number
            /** 账号名称 */
            name: string
            /** 角色 */
            character: string
            /** 账号状态 (1:启用, 2:禁用) */
            status: number
            /**最近登录时间 */
            lastLoginAt?: string
        }

        /** 操作日志搜索参数 */
        type OprationSearchParams = Partial<Pick<OprationListItem, 'name'> & Api.Common.CommonSearchParams>
    }
}
